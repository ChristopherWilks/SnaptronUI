/**
 * Created by Phani on 3/12/2016.
 */
Template.selectionPanel.helpers({
    isUsersQuery: function () {
        return SnapApp.QueryDB.isQueryCurrentUsers(Queries.findOne()["_id"]);
    },
    selectionTitle: function () {
        SnapApp.selectedJnctIDsDep.depend();
        var len = SnapApp.selectedJnctIDs.length;
        if (len == 0)
            return "No junctions selected";
        if (len == 1)
            return SnapApp.selectedJnctIDs.length + " junction selected";
        return SnapApp.selectedJnctIDs.length + " junctions selected";
    },
    anyJunctionsSelected: function () {
        SnapApp.selectedJnctIDsDep.depend();
        return SnapApp.selectedJnctIDs.length > 0;
    }
});

Template.selectionPanel.events({
    "click #addQryGroupBtn": function (evt, template) {
        evt.preventDefault();
        onAddGroup(template);
    },
    "click #clearSelectionBtn": function (evt) {
        evt.preventDefault();
        onClearSelection();
    }
});

function onClearSelection() {
    SnapApp.selectedJnctIDs = [];
    SnapApp.selectedJnctIDsDep.changed();
}

function onAddGroup(template) {
    var name = template.find("#addGroupInputName").value;
    Meteor.call("addGroupToQuery", Queries.findOne()["_id"], name, SnapApp.selectedJnctIDs);
}