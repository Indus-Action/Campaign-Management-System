from rest_framework import viewsets, generics, views, status
from rest_framework.response import Response

from ivrs.models import IVR
from ivrs.serializers import IVRSerializer
from calls.models import Call


class IVRViewSet(viewsets.ModelViewSet):
    queryset = IVR.objects.order_by('-created_at')
    serializer_class = IVRSerializer


class BeneficiaryIVRsView(generics.ListAPIView):
    serializer_class = IVRSerializer

    def get(self, request, user_pk=None):
        queryset = IVR.objects.filter(beneficiary=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class SentIVRsView(generics.ListAPIView):
    serializer_class = IVRSerializer

    def get(self, request, user_pk=None):
        queryset = IVR.objects.filter(sender=user_pk)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class FeedbackIVRView(views.APIView):
    number_of_questions = 6

    credits = {
        "default": 100/number_of_questions
    }

    grades = {
        "default": {
            "1": 1,
            "2": 0.4
        },
        "q6": {
            "1": 0.4,
            "2": 0.55,
            "3": 0.70,
            "4": 0.85,
            "5": 1
        }
    }

    def get(self, request, format=None):
        args_dict = dict(request.GET.iterlists())

        question = ''
        response = ''
        question_credits = 0
        final_credits = 0

        total_credits = 0
        credits_count = 0

        for key in self.credits.keys():
            if key != 'default':
                total_credits += self.credits[key]
                credits_count += 1

        while credits_count < self.number_of_questions:
            total_credits += 100/float(self.number_of_questions)
            credits_count += 1

        mobile = ''

        if 'question' in args_dict.keys():
            question = str(args_dict['question'][0])

        if 'response' in args_dict.keys():
            response = str(args_dict['response'][0])

        if 'From' in args_dict.keys():
            mobile = str(args_dict['From'][0])[1:]
        else:
            return Response({'status': 'mobile not available'}, status.HTTP_400_BAD_REQUEST)

        if question in self.credits.keys():
            question_credits = self.credits[question]
        else:
            question_credits = self.credits["default"]

        if question in self.grades.keys():
            if response in self.grades[question].keys():
                final_credits = question_credits * self.grades[question][response]
        else:
            if response in self.grades["default"].keys():
                final_credits = question_credits * self.grades["default"][response]

        call = Call.objects.filter(beneficiary__profile__mobile=mobile).last()

        final_credits = final_credits / float(total_credits) * 5

        task = call.task
        task.assignee_rating += final_credits
        task.save()

        return Response({'status': 'ok'}, status.HTTP_200_OK)
