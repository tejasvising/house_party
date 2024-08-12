from rest_framework import serializers
from .models import Room
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('id','code','host','guest_can_pause', 'votes_to_skip', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('guest_can_pause', 'votes_to_skip')  

class UpdateRoomSerializer(serializers.ModelSerializer):
    code=serializers.CharField(validators=[]) # redefined the code field so that we don't reference it directly from our model
    # we have done so because our model wants 'code' to be unique and here update room serializer would be used for a patch function (meaning modify) so there is 0 chance that this code would be unique as we would update our settings here on the room with this code
    class Meta:
        model=Room
        fields=('guest_can_pause', 'votes_to_skip','code')  
   