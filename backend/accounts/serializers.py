from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Read-only serializer for user profile (e.g. after login)."""

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "role",
            "date_joined",
            "is_active",
        )
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration. New users are always created as Member."""

    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ("username", "email", "password", "password_confirm")
        extra_kwargs = {"email": {"required": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        attrs.pop("password_confirm", None)
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(role=User.Roles.MEMBER, **validated_data)
        user.set_password(password)
        user.save(update_fields=["password"])
        return user
