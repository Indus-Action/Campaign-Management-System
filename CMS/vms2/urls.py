"""vms2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework_nested import routers

from rest_auth.views import LogoutView

from locations.views import LocationViewSet

from tasks.views import TaskViewSet, BeneficiaryTasksView, AssignedTasksView, CreatedTasksView, tasks_assign, tasks_smart_assign, FilterTasksView, PaginatedTaskViewSet, get_tasks_length, get_tasks_page_size, export_tasks_view, create_bulk_tasks, import_data_view, get_filtered_tasks_length, PledgedTasksView,create_task
from task_types.views import TaskTypeViewSet
from task_status.views import TaskStatusViewSet
from feedback_types.views import FeedbackTypeViewSet
from organisations.views import OrganisationViewSet
from authentication.views import UserViewSet
from user_profiles.views import *
from forms.views import FormViewSet, FormDataViewSet, DataByFormView, PersistentFormViewSet, PersistentFormDataView,export_filtered_form_data
from training_kits.views import *
from stages.views import StageViewSet
from notes.views import NoteViewSet, BeneficiaryNotesView, CreatedNotesView
from user_messages.views import MessageViewSet, BeneficiaryMessagesView, SentMessagesView
from todos.views import TodoViewSet, AssignedTodosView, CreatedTodosView, BeneficiaryTodosView
from tags.views import (TagViewSet, LightTagViewSet, UserTagsView, UserLightTagsView,
                        RemoveUserFromTag, RemoveExclusiveTagFromTag,
                        AddTagToUser, AddTagsToUser, AddExclusiveTagToTag)
from message_templates.views import MessageTemplateViewSet
from calls.views import CallViewSet, BeneficiaryCallsView, CallerCallsView
from task_status_categories.views import TaskStatusCategoryViewSet, CreatedTaskStatusCategoriesView, getTaskCompletedFlagChoices
from actions.views import get_action_classes, ActionViewSet
from events.views import EventViewSet
from event_conditions.views import EventConditionViewSet, getEventConditionTypes, HelplineEventConditionsView, NormalEventConditionsView
from hooks.views import HookViewSet
from ivrs.views import IVRViewSet, BeneficiaryIVRsView, SentIVRsView, FeedbackIVRView
from ivr_templates.views import IVRTemplateViewSet
from exotel.views import MissedCall, ExotelViewSet, IncSMS, Lottery, DostPaid, DostMother, DostFather
from guilds.views import GuildViewSet, add_users_to_guild
from notices.views import NoticeViewSet
from spaces.views import SpaceViewSet
from space_types.views import SpaceTypeViewSet, add_spaces
from interests.views import InterestViewSet, LightInterestViewSet, AddInterestsToUser, RemoveInterestsFromUser, UserInterestsView
from pledges.views import PledgeViewSet, TaskPledgesView, UserPledgesView
from party_invitations.views import PartyInvitationViewSet, SentPartyInvitationsView, ReceivedPartyInvitationsView
from task_comments.views import TaskCommentViewSet, TaskCommentDetailedViewSet, TaskCommentsView, CommentedCommentsView
from follows.views import FollowViewSet, FollowerFollowsView, FollowedFollowsView, get_follow
from centers.views import CenterViewSet
from locations.views import LocationViewSet
from kits.views import KitViewSet
from parents.views import ParentViewSet,ParentWorkerListViewSet
from worker.views import WorkerViewSet
from child.views import ChildViewSet
from payments.views import PaymentViewSet,PaymentWorkerListViewSet,PaymentDateListViewSet
from assessments.views import AssessmentViewSet
from questions.views import QuestionViewSet
from assessmentreports.views import AssessmentItemViewSet

router = routers.SimpleRouter()

router.register(r'centers',CenterViewSet)
router.register(r'kits',KitViewSet)
router.register(r'parents',ParentViewSet)
router.register(r'workers',WorkerViewSet)
router.register(r'child',ChildViewSet)
router.register(r'assessments',AssessmentViewSet)
router.register(r'questions',QuestionViewSet)
router.register(r'assessmentitems',AssessmentItemViewSet)
router.register(r'payments',PaymentViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'task_types', TaskTypeViewSet)
router.register(r'task_status', TaskStatusViewSet)
router.register(r'feedback_types', FeedbackTypeViewSet)
router.register(r'stages', StageViewSet)
router.register(r'organisations', OrganisationViewSet)
router.register(r'users_model', UserViewSet)
router.register(r'users', UserDetailViewSet)
router.register(r'forms', FormViewSet)
router.register(r'forms-data', FormDataViewSet)
router.register(r'trainingkits', TrainingKitViewSet)
router.register(r'trainingkitpages', TrainingKitPagesViewSet)
router.register(r'pages', PageViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'todos', TodoViewSet)
router.register(r'tags', TagViewSet)
router.register(r'light_tags', LightTagViewSet)
router.register(r'message_templates', MessageTemplateViewSet)
router.register(r'calls', CallViewSet)
router.register(r'task_status_categories', TaskStatusCategoryViewSet)
router.register(r'events', EventViewSet)
router.register(r'event_conditions', EventConditionViewSet)
router.register(r'hooks', HookViewSet)
router.register(r'actions', ActionViewSet)
router.register(r'ivrs', IVRViewSet)
router.register(r'ivr_templates', IVRTemplateViewSet)
router.register(r'exotel', ExotelViewSet)
router.register(r'guilds', GuildViewSet)
router.register(r'paginated_tasks', PaginatedTaskViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'spaces', SpaceViewSet)
router.register(r'space_types', SpaceTypeViewSet)
router.register(r'persistent_forms', PersistentFormViewSet)
router.register(r'interests', InterestViewSet)
router.register(r'light_interests', LightInterestViewSet)
router.register(r'pledges', PledgeViewSet)
router.register(r'party_invitations', PartyInvitationViewSet)
router.register(r'task_comments', TaskCommentViewSet)
router.register(r'task_comments_detailed', TaskCommentDetailedViewSet)
router.register(r'follows', FollowViewSet)

urlpatterns = patterns(
    '',
     url(r'^dbmodels/', include('dbmodels.urls')),
    url(r'^signup/$', TemplateView.as_view(template_name="signup.html"),
        name='signup'),
    url(r'^email-verification/$',
        TemplateView.as_view(template_name="email_verification.html"),
        name='email-verification'),
    url(r'^login/$', TemplateView.as_view(template_name="login.html"),
        name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
    url(r'^password-reset/$',
        TemplateView.as_view(template_name="password_reset.html"),
        name='password-reset'),
    url(r'^password-rest/confirm/$',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password-reset-confirm'),
    url(r'^user-details/$',
        TemplateView.as_view(template_name="user_details.html"),
        name='user-details'),
    url(r'^user-details/edit/$',
        TemplateView.as_view(template_name="user_details_edit.html"),
        name='user-details-edit'),
    url(r'^password-change/$',
        TemplateView.as_view(template_name="password_change.html"),
        name='password-change'),

    url(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',  # noqa
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password_reset_confirm'),

    url(r'^accounts/', include('allauth.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^rest-auth/user/(?P<token>\w+)/$',
        CustomUserDetailsView.as_view(),
        name='rest_user_details_custom'),
    url(r'^rest-auth/registration/account-confirm-email/(?P<key>.+)/$',
        verifyEmailRedirect,
        name='account_confirm_email'),
    url(r'^rest-auth/password/reset/confirm/$',
        passwordResetConfirmRedirect.as_view()),
    url(r'^rest-auth/registration/$',
        CustomRegisterView.as_view(),
        name='custom_user_register'),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),

    url('^api/v1/users/usertype/(?P<user_type>\w+)/$',
        UserTypeUserList.as_view(),
        name='usertype_user'),
    url('^api/v1/users/usertypes/',
        UserTypesUserList.as_view(),
        name='usertypes_users'),
    url('^api/v1/admin/users/(?P<user_id>\w+)/$',
        UserManagementAdmin.as_view(),
        name='user_management_admin'),
    url('^api/v1/user/altmobile/(?P<user_id>\w+)/$',
        AlternateNumbersList.as_view(),
        name='user_alt_mobile'),
    url('^api/v1/users/usertype/$',
        getUserTypes,
        name='usertypes'),
    url('^api/v1/users/guild/(?P<guild_pk>\w+)/$',
        GuildMembersList.as_view(),
        name='guild_members_list'),

    url('^api/v1/trainingkits/pagetypes/$',
        getPageContentTypes,
        name="trainingkit_pagetypes"),
    url('^api/v1/pages/fileupload/$',
        PageFileUpload.as_view(),
        name='trainingkit_page_fileupload'),
    url('^api/v1/form-data/(?P<form_id>\w+)/$', DataByFormView.as_view()),

    url('^api/v1/notes/beneficiary/(?P<user_pk>\w+)/$',
        BeneficiaryNotesView.as_view(),
        name='beneficiary_notes'),
    url('^api/v1/notes/creator/(?P<user_pk>\w+)/$',
        CreatedNotesView.as_view(),
        name='created_notes'),

    url('^api/v1/messages/beneficiary/(?P<user_pk>\w+)/$',
        BeneficiaryMessagesView.as_view(),
        name='beneficiary_messages'),
    url('^api/v1/messages/sender/(?P<user_pk>\w+)/$',
        SentMessagesView.as_view(),
        name='sent_messages'),

    url('^api/v1/party_invitations/sender/(?P<sender_pk>\w+)/$',
        SentPartyInvitationsView.as_view(),
        name='sent_invitations'),
    url('^api/v1/party_invitations/invitee/(?P<invitee_pk>\w+)/$',
        ReceivedPartyInvitationsView.as_view(),
        name='received_invitations'),

    url('^api/v1/task_comments_detailed/commentor/(?P<commentor_pk>\w+)/$',
        CommentedCommentsView.as_view(),
        name='commented_comments'),
    url('^api/v1/task_comments_detailed/task/(?P<task_pk>\w+)/$',
        TaskCommentsView.as_view(),
        name='task_comments'),

    url('^api/v1/ivrs/beneficiary/(?P<user_pk>\w+)/$',
        BeneficiaryIVRsView.as_view(),
        name='beneficiary_ivrs'),
    url('^api/v1/ivrs/sender/(?P<user_pk>\w+)/$',
        SentIVRsView.as_view(),
        name='sent_ivrs'),
    url('^api/v1/ivrs/feedback/$',
        FeedbackIVRView.as_view(),
        name='feedback_ivr'),

    url('^api/v1/todos/assignee/(?P<user_pk>\w+)/$',
        AssignedTodosView.as_view(),
        name='assigned_todos'),
    url('^api/v1/todos/creator/(?P<user_pk>\w+)/$',
        CreatedTodosView.as_view(),
        name='created_todos'),
    url('^api/v1/todos/beneficiary/(?P<user_pk>\w+)/$',
        BeneficiaryTodosView.as_view(),
        name='beneficiary_todos'),

    url('^api/v1/tasks/assignee/(?P<user_pk>\w+)/$',
        AssignedTasksView.as_view(),
        name='assigned_tasks'),
    url('^api/v1/tasks/creator/(?P<user_pk>\w+)/$',
        CreatedTasksView.as_view(),
        name='created_tasks'),
    url('^api/v1/tasks/beneficiary/(?P<user_pk>\w+)/$',
        BeneficiaryTasksView.as_view(),
        name='beneficiary_tasks'),
    url('^api/v1/tasks/assign/',
        tasks_assign,
        name='tasks_assign'),
    url('^api/v1/tasks/smart_assign/',
        tasks_smart_assign,
        name='tasks_smart_assign'),
    url('^api/v1/tasks/filter/',
        FilterTasksView.as_view(),
        name='filter_tasks'),

    url('^api/v1/users/filter/',
        UserDetailFilterViewSet.as_view(),
        name='filter_users'),

    url('^api/v1/tasks/length/',
        get_tasks_length,
        name='tasks_length'),
    url('^api/v1/filtered_tasks/length/',
        get_filtered_tasks_length,
        name='filtered_tasks_length'),

    url('^api/v1/tags/user/(?P<user_pk>\w+)/$',
        UserTagsView.as_view(),
        name='user_tags'),
    url('^api/v1/light_tags/user/(?P<user_pk>\w+)/$',
        UserLightTagsView.as_view(),
        name='user_tags'),

    url('^api/v1/follows/follower/(?P<follower_pk>\w+)/$',
        FollowerFollowsView.as_view(),
        name='follower_follows'),
    url('^api/v1/follows/followed/(?P<followed_pk>\w+)/$',
        FollowedFollowsView.as_view(),
        name='followed_follows'),

    url('^api/v1/follows/get_follow/$', get_follow, name='get_follow'),

    url('^api/v1/remove_tag/$', RemoveUserFromTag.as_view(), name='remove_tag'),
    url('^api/v1/remove_mutually_exclusive_tag/$', RemoveExclusiveTagFromTag.as_view(), name='remove_exclusive_tag'),
    url('^api/v1/add_tag/$', AddTagToUser.as_view(), name='add_tag'),
    url('^api/v1/add_tags/$', AddTagsToUser.as_view(), name='add_tags'),
    url('^api/v1/add_mutually_exclusive_tag/$', AddExclusiveTagToTag.as_view(), name='add_exclusive_tag'),

    url('^api/v1/interests/(?P<user_pk>\w+)/$', UserInterestsView.as_view(), name='user_interests'),
    url('^api/v1/add_interests/$', AddInterestsToUser.as_view(), name='add_interests'),
    url('^api/v1/remove_interests/$', RemoveInterestsFromUser.as_view(), name='remove_interests'),

    url('^api/v1/calls/beneficiary/(?P<beneficiary_pk>\w+)/$',
        BeneficiaryCallsView.as_view(),
        name='beneficiary_calls'),
    url('^api/v1/calls/caller/(?P<caller_pk>\w+)/$',
        CallerCallsView.as_view(),
        name='caller_calls'),

    url('^api/v1/pledges/user/(?P<user_pk>\w+)/$',
        UserPledgesView.as_view(),
        name='user_pledges'),
    url('^api/v1/pledges/task/(?P<task_pk>\w+)/$',
        TaskPledgesView.as_view(),
        name='task_pledges'),
    url('^api/v1/tasks/pledged/(?P<user_pk>\w+)/$',
        PledgedTasksView.as_view(),
        name='pledged_tasks'),

    url('^api/v1/task_status_categories/creator/(?P<user_pk>\w+)/$',
        CreatedTaskStatusCategoriesView.as_view(),
        name='created_task_status_categories'),
    url('^api/v1/task_status_categories/flag_choices/',
        getTaskCompletedFlagChoices,
        name='task_completed_flag_choices'),

    url('^api/v1/get_action_classes/', get_action_classes),

    url('^api/v1/event_conditions/event_condition_types/$',
        getEventConditionTypes,
        name='event_condition_types'),
    url('^api/v1/event_conditions/helpline/$',
        HelplineEventConditionsView.as_view(),
        name='helpline_event_conditions'),
    url('^api/v1/event_conditions/normal/$',
        NormalEventConditionsView.as_view(),
        name='normal_event_conditions'),

    url('^api/v1/missedcall/$', MissedCall.as_view()),
    url('^api/v1/incsms/$', IncSMS.as_view()),
    url('^api/v1/lottery/$', Lottery.as_view()),
    url('^api/v1/dostfather/$', DostFather.as_view()),    
    url('^api/v1/dostmother/$', DostMother.as_view()),    
    url('^api/v1/dostpaid/$', DostPaid.as_view()),

    url('^api/v1/guilds/add_users/', add_users_to_guild),

    url('^api/v1/space_types/add_spaces/', add_spaces),

    url('^api/v1/tasks/page_size/', get_tasks_page_size),

    url('^api/v1/persistent_form_data/(?P<user_pk>\w+)/$',
        PersistentFormDataView.as_view(),
        name='persistent_form_data'),

    url('^api/v1/tasks/export/$',
        export_tasks_view,
        name='export_tasks'),


    url('^api/v1/tasks/import/$',
        import_data_view,
        name='import_data'),

    url('^api/v1/form/filter/$',
        export_filtered_form_data,
        name='export_form_data'),

    url('api/v1/tasks/bulk_create/$',
        create_bulk_tasks,
        name='create_bulk_tasks'),

    url('api/v1/tasks/create/$',
        create_task,
        name='create_task'),

    url('^api/v1/payments/worker/(?P<worker>\w+)/$',
        PaymentWorkerListViewSet.as_view(),
        name='worker_payments'),

    url('^api/v1/payments/date/(?P<date>\w+)/$',
        PaymentDateListViewSet.as_view(),
        name='date_payments'),

    url('^api/v1/parents/worker/(?P<worker>\w+)/$',
        ParentWorkerListViewSet.as_view(),
        name='worker_parents'),

    url('^api/v1/', include(router.urls)),
    url(r'^.*$', TemplateView.as_view(template_name="home.html"), name='home'),

)
