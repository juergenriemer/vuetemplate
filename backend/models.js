const models = {
    "Post": {
        "Model": {
            "title": {
                "type": "String",
                "required": true,
                "display": "XTitle",
                "minlength": 3,
                "maxlength": 20
            },
            "description": {
                "type": "String",
                "display": "Description",
                "minlength": 3,
                "maxlength": 200
            },
            "prio": {
                "type": "Boolean",
                "display": "has priority"
            },
            "year": {
                "type": "Number",
                "display": "Year",
                "min": 1900,
                "max": 2050
            }
        },
        "aggregates": {
            "empty": {
                "title": null,
                "description": null,
                "prio": null,
                "year": null
            }
        }
    }
}
export default models;