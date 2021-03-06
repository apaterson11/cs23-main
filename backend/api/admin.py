from django.contrib import admin
from api.models import (
    City,
    Country,
    Landmark,
    LandmarkImage,
    Layer,
    Map,
    MapStyle,
    Profile,
    Project,
    State
)

class LandmarkImageAdmin(admin.StackedInline):
    model = LandmarkImage

@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    inlines = [LandmarkImageAdmin]
    list_display = ('content', 'latitude', 'longitude', 'layer', 'map')

@admin.register(Layer)
class LayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'map')

@admin.register(LandmarkImage)
class LandmarkImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'landmark', 'image')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'group', 'creator', 'hash_field')


admin.site.register(City)
admin.site.register(Country)
admin.site.register(Map)
admin.site.register(Profile)
admin.site.register(State)
admin.site.register(MapStyle)
