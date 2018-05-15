from rest_framework import serializers

from todos.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo

        fields = ('id', 'todo', 'reporter', 'beneficiary', 'assignee', 'due_date', 'created_at', 'updated_at', 'done')
        read_only_fields = ('id', 'created_at', 'updated_at',)
