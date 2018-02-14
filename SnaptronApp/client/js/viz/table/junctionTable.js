/**
 * Created by Phani on 2/25/2016.
 */

Template.junctionTable.helpers({
    "junctionTableCollection": function () {
	if ((Session.get("sampleIDFiltered") != 1) &&
		(Session.get("sampleIDsInput") != null && 
		 Session.get("sampleIDsInput") != undefined && 
		 Session.get("sampleIDsInput") != '')) {

		sampleIDs = Session.get("sampleIDsInput").split(/[\s,]+/);
		//console.log("filtering sample IDs " + sampleIDs);
		jxl = Junctions._collection;
		sample_sums = {}
		for(var i = 0; i < sampleIDs.length; i++) {
			sample_sums[sampleIDs[i]] = 0.0;
		}
		//now derive the per-sample ratios
		jxl.find().forEach(function(jx) {
			//console.log("filtering sample IDs " + jx.samples_covs);
			covs = jx.samples_covs[jx.samples.indexOf(sampleIDs[0])].split(':');
			sample_sums[sampleIDs[0]] += parseFloat(covs[1]);
			for(var i = 1; i < sampleIDs.length; i++) {
				covs = jx.samples_covs[jx.samples.indexOf(sampleIDs[i])].split(':');
				sample_sums[sampleIDs[i]] += parseFloat(covs[1]);
			}
		});
		jxl.find().forEach(function(jx) {
			covs = jx.samples_covs[jx.samples.indexOf(sampleIDs[0])];
			sids = covs;
			covs = covs.split(':');
			cov_ = parseFloat(covs[1]) / sample_sums[sampleIDs[0]];
			sample_ratios = cov_.toFixed(3);
			for(var i = 1; i < sampleIDs.length; i++) {
				cov_ = jx.samples_covs[jx.samples.indexOf(sampleIDs[i])];
				sids += ","+cov_;
				covs = cov_.split(':');
				cov_ = parseFloat(covs[1]) / sample_sums[sampleIDs[i]];
				sample_ratios += "," + cov_.toFixed(3);
			}
			//console.log(sids)
			jxl.update({_id: jx._id}, {$set: { samples_covs: sids } });
			jxl.update({_id: jx._id}, {$set: { samples_ratios: sample_ratios } });

		});

		Session.set("sampleIDFiltered",1);
	}
	/*if ((Session.get("jxCovRatio") != 1) &&
		(Session.get("sampleIDsInput") != null && Session.get("sampleIDsInput") != undefined)) {

		sampleIDs = Session.get("sampleIDsInput").split(/[\s,]+/);
		jxl = Junctions._collection;
		samp_sums = {}
		jxl.find().forEach(function(jx) {
			sids = jx.samples_covs[jx.samples.indexOf(sampleIDs[0])];
			for(var i = 1; i < sampleIDs.length; i++) {
				sids += jx.samples_covs[jx.samples.indexOf(sampleIDs[i])];
			}
		});
		Session.set("jxCovRatio",1);
	}*/
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
