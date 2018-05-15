from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError
from user_profiles.models import UserProfile
from forms.models import PersistentFormData
from stages.models import Stage
from tags.models import Tag

import csv, codecs, cStringIO


class DictUnicodeWriter(object):
    def __init__(self, f, fieldnames, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.fieldnames = fieldnames
        self.writer = csv.DictWriter(self.queue, fieldnames, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, D):
        self.writer.writerow({k: v.encode("utf-8") for k, v in D.items() if isinstance(v, (str, unicode))})
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for D in rows:
            self.writerow(D)

    def writeheader(self):
        header = dict(zip(self.fieldnames, self.fieldnames))
        self.writerow(header)


class Command(BaseCommand):
    def handle(self, *args, **options):

        print "Beginning to extract the information"

        user_data = []
        count = 1

        print "Appying the filter to get the users from the database"
        user_applied_data = UserProfile.objects.all()

        print "The total number of  users are " + str(user_applied_data.count())

        for user_profile in user_applied_data:

            if (len(user_data) == 10000):
                keys = user_data[0].keys()

                with open('/home/ubuntu/vms2/user_child_Data_' + str(count) + '.csv', 'w+') as f:
                    dict_writer = DictUnicodeWriter(f, keys, extrasaction='ignore')

                    dict_writer.writeheader()
                    # try:
                    dict_writer.writerows(user_data)
                user_data = []
                print str(count) + " Completed"

                count += 1

                user_dict = {}

                # print "Extracting the user"
                user = user_profile.user
                user_persistent_form_data=None
                # print "Extracting the persistent form for the user"
                user_persistent_form_data = PersistentFormData.objects.filter(beneficiary=user)

                user_dict['mobile'] = user_profile.mobile

            if (user_persistent_form_data is None or user_persistent_form_data.count() == 0):

                user_dict['Father\'s Name'] = ""
                user_dict["Mother\'s Name"] = ""

            else:

                if ("Father Details" in user_persistent_form_data[0].data.keys() and "Name" in
                    user_persistent_form_data[0].data["Father Details"].keys()):
                    user_dict['Father\'s Name'] = user_persistent_form_data[0].data["Father Details"]["Name"]
                else:
                    user_dict['Father\'s Name'] = ""

                if ("Mother Details" in user_persistent_form_data[0].data.keys() and "Name" in
                    user_persistent_form_data[0].data["Mother Details"].keys()):
                    user_dict["Mother\'s Name"] = user_persistent_form_data[0].data["Mother Details"]["Name"]
                else:
                    user_dict["Mother\'s Name"] = ""

                if "Children" in user_persistent_form_data[0].data.keys():
                    count = 0
                for child in user_persistent_form_data[0].data["Children"]:
                    count += 1

                    if ("Name" in child.keys()):
                        user_dict["Child Name " + str(count)] = child["Name"]
                    else:
                        user_dict["Child Name" + str(count)] = "No Info Available"

                    if ("Date of Birth" in child.keys()):
                        user_dict["Child DOB " + str(count)] = child["Date of Birth"]
                    else:
                        user_dict["Child DOB" + str(count)] = "No Info Available"

                    if ("Gender" in child.keys()):
                        user_dict["Gender" + str(count)] = child["Gender"]
                    else:
                        user_dict["Gender" + str(count)] = "No Info Available"

                    if ("School Name" in child.keys()):
                        user_dict["School Name" + str(count)] = child["School Name"]

                    else:
                        user_dict["School Name" + str(count)] = "No Info Available"

# print "Information retrieved"
            user_data.append(user_dict)




















