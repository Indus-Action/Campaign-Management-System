from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from events.models import Event
from event_conditions.models import EventCondition
from guilds.models import Guild
from stages.models import Stage
from tags.models import Tag
from training_kits.models import TrainingKit


class UserProfile(models.Model):
    USER_AUTH_TYPES = (
            ('HL', 'Helpline'),
            ('VL', 'Volunteer'),
            ('AD', 'Admin'),
            ('BN', 'Beneficiary'),
            ('SS','ShikshaSahyogi'),
            ('SSCoach','ShikshaSahyogiCoach'),
        )

    archived = models.BooleanField(default=False)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        null=True
    )
    owner=models.ForeignKey(
        User,null=True)
    mobile = models.CharField(max_length=20, default='', unique=True)
    alt_mobile = JSONField(default=[])
    stage = models.ForeignKey(Stage, null=True, related_name='users')
    points = models.IntegerField(default=800)
    number_of_missed_calls = models.IntegerField(default=0)
    guild = models.ForeignKey(Guild, null=True, related_name='users')

    user_type = models.CharField(
            max_length = 10,
            choices = USER_AUTH_TYPES,
            default = 'BN'
        )

    training_kits_seen = models.ManyToManyField(TrainingKit, blank=True,
                                                related_name='users_seen')

    # TODO: IMPROVE THIS
    # TODO: Find way to add creator to the event
@receiver(post_save, sender=UserProfile, dispatch_uid="first_profile_save")
def user_profile_post_save_method(instance, **kwargs):
    if instance.user:
        stage = instance.stage
        tags = instance.user.tags.all()

        conditions = EventCondition.objects.filter((Q(stage__isnull=True) | Q(stage=stage)) &
                                                   (Q(event_tags__isnull=True) | Q(event_tags__in=tags)) &
                                                   Q(event_condition_type='USER') &
                                                   Q(event_condition_category='NR'))

        for condition in conditions:
            Event.objects.create(name=condition.name, event_condition=condition, user=instance.user)

@receiver(m2m_changed, sender=Tag.users.through, dispatch_uid="first_tag_add")
def user_tags_changed_method(instance, **kwargs):
    action = kwargs['action']

    if action == 'post_add' or action == "post_remove":
        users = kwargs['pk_set']
        for pk in users:
            user = User.objects.get(pk=pk)
            stage = user.profile.stage
            tags = user.tags.all()

            conditions = EventCondition.objects.filter((Q(stage__isnull=True) | Q(stage=stage)) &
                                                       (Q(event_tags__isnull=True) | Q(event_tags__in=tags)) &
                                                       Q(event_condition_type='USER') &
                                                       Q(event_condition_category='NR'))

            for condition in conditions:
                Event.objects.create(name=condition.name, event_condition=condition, user=user)

post_save.connect(user_profile_post_save_method, sender=UserProfile, dispatch_uid="first_profile_save")
m2m_changed.connect(user_tags_changed_method, sender=Tag.users.through, dispatch_uid="first_add_tag")
