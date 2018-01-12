/**
 * Created by Phani on 2/25/2016.
 */

Template.junctionTable.helpers({
    "junctionTableCollection": function () {
	if ((Session.get("sampleIDFiltered") != 1) &&
		//|| Session.get("sampleIDFiltered") == undefined) && 
		(Session.get("sampleIDsInput") != null && Session.get("sampleIDsInput") != undefined)) {
	sampleIDs = Session.get("sampleIDsInput").split(/[\s,]+/);
	console.log("filtering sample IDs " + sampleIDs);
	jxl = Junctions._collection;
	jxl.find().forEach(function(jx) {
		sids = jx.samples_covs[jx.samples.indexOf(sampleIDs[0])];
		for(var i = 1; i < sampleIDs.length; i++) {
			sids += ","+jx.samples_covs[jx.samples.indexOf(sampleIDs[i])];
		}
		//console.log(sids)
		jxl.update({_id: jx._id}, {$set: { samples_covs: sids } });
	});
	Session.set("sampleIDFiltered",1);
	}
        return Junctions;
    },
    "tableSettings": function () {
        //Generate neat headers
        var tableColumns = Object.keys(Junctions.findOne());
        var fields       = [];
        for (var i = 0; i < tableColumns.length; i++) {
            fields.push({
                key: tableColumns[i],
                label: formatHeaderText(tableColumns[i]),
                hidden: (SnapApp.Table.DEFAULT_ENABLED_COLS.indexOf(tableColumns[i]) == -1)
            });
        }
	//console.log(tableColumns);
	//console.log(fields);

        return {
            "showColumnToggles": true,
            "fields": fields,
            "showFilter": false,
            "rowsPerPage": 15,
            "rowClass": getRowClass
        };
    }
});

Template.junctionTable.events({
    "click #rawTSVBtn": function (event, template) {
        Router.go(Router.current().url + "/dataTSV");
    },
    "click .reactive-table tbody tr": onRowClicked,
    "dblclick .reactive-table tbody tr": onRowClicked
});

function onRowClicked(event) {
    event.preventDefault();
    var index = SnapApp.selectedJnctIDs.indexOf(this._id);
    if (index > -1) {
        // Unselect
        SnapApp.selectedJnctIDs.splice(index, 1);
    } else {
        SnapApp.selectedJnctIDs.push(this._id);
    }
    SnapApp.selectedJnctIDsDep.changed();
}

function getRowClass(jnct) {
    SnapApp.selectedJnctIDsDep.depend();
    if (SnapApp.selectedJnctIDs.indexOf(jnct["_id"]) > -1) {
        return SnapApp.Table.ROW_SELECTED_CLASS;
    }
    return SnapApp.Table.ROW_NORMAL_CLASS;
}

function formatHeaderText(str) {
    return str.toUpperCase().replace(/_/g, " ").trim();
}
