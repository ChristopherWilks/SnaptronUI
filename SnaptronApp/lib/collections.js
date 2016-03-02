/**
 * Collection organization scheme:
 *
 * Queries
 * --------
 *  _id: Generated by mongo, used as the URL to access it (/query/_id)
 *  regions: Array referencing regions._id that were a part of this query
 *  createdDate: Date the query was created
 *  filters: Array of filters to perform on junctions. Each filter has the format:
 *      {   "filter" : "junctions.xxx",
 *          "op" : "some_mongo_operator",
 *          "val" : some_value  }
 *
 *  Regions
 *  --------
 *  _id: Lower case and trimmed ID of the region used in the Snaptron query. E.G: "cd99", "ch6:1-1000"
 *  loadedDate: Date when this was loaded. null if never loaded (or failed to load)
 *  junctions: Array of junctions._id
 *  metadata: Array of {key:"someKey", value:"someValue"} metadata elements returned by Snaptron
 *
 *  Junctions
 *  ---------
 *  _id: Value of snaptron_id returned by Snaptron
 *  ** The rest of the fields are generated by Snaptron's response. The following are assumed to exist**
 *  samples_count
 *  coverage_sum
 *  coverage_avg
 *  coverage_median
 *  start
 *  stop
 *  length
 */

Queries = new Mongo.Collection("queries");
Regions = new Mongo.Collection("regions");
Junctions = new Mongo.Collection("junctions");

MONGO_OPERATOR_EQ = "$eq";
MONGO_OPERATOR_GT = "$gt";
MONGO_OPERATOR_LT = "$lt";
MONGO_OPERATOR_GTE = "$gte";
MONGO_OPERATOR_LTE = "$lte";

QRY_REGIONS = "regions";
QRY_FILTERS = "filters";
QRY_CREATED_DATE = "createdDate";

QRY_FILTER_FIELD = "filter";
QRY_FILTER_OP = "op";
QRY_FILTER_VAL = "val";
QRY_FILTER_SAMPLE_COUNT = "samples_count";
QRY_FILTER_COV_SUM = "coverage_sum";
QRY_FILTER_COV_AVG = "coverage_avg";
QRY_FILTER_COV_MED = "coverage_median";
QRY_FILTER_LENGTH = "length";

REGION_METADATA = "metadata";
REGION_LOADED_DATE = "loadedDate";
REGION_JUNCTIONS = "junctions";
REGION_METADATA_KEY = "key";
REGION_METADATA_VAL = "value";

JNCT_ID_FIELD = "snaptron_id";
JNCT_ANNOTATED_KEY = "annotated?";
JNCT_COL_TYPES = {
    "DataSource:Type": "str",
    "snaptron_id": "str",
    "chromosome": "str",
    "start": "int",
    "end": "int",
    "length": "int",
    "strand": "str",
    "annotated?": "bool",
    "left_motif": "str",
    "right_motif": "str",
    "left_annotated?": "str",
    "right_annotated?": "str",
    "samples": "str[]",
    "read_coverage_by_sample": "float[]",
    "samples_count": "int",
    "coverage_sum": "float",
    "coverage_avg": "float",
    "coverage_median": "float",
    "source_dataset_id": "str"
};