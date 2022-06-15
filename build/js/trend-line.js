import {select, pointer} from 'd3-selection';
import {View, parse} from 'vega';

class TrendLine {
    dom = {container:null}
    width = 480;
    height = 320;

    constructor(container) {
        this.container = select(container).append("div").node();
        this.view = new View(parse(this.vega_spec));
        this.view.initialize(this.container).renderer("svg").runAsync();
    }

    clear(){
        
    }

    data(){

    }

    vega_spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "State-level child poverty almanac",
        "autosize":{"type": "fit", "resize": false},
        "width": 480,
        "height": 240,
        "padding": {"top":0,"left":0,"right":0, "bottom":0},
        "title":{
            "text":""
        },

        "signals":[
            {
                "name": "container_width",
                "update": "containerSize()[0]",
                "on": [
                    {
                        "events": {"source": "window", "type": "resize"},
                        "update": "containerSize()[0]"
                    }
                ]
            },
            {
                "name": "viewport_breaks",
                "value": [420, 780]
            },
            {
                "name": "is_narrow",
                "value": true,
                "update":"container_width < viewport_breaks[1]"
            },
            {
                "name":"width",
                "update": "is_narrow ? viewport_breaks[0] : viewport_breaks[1]"
            }
        ],

        "data":[
            {
                "name": "table",
                "values": [{"value":1, "year":1900}, {"value":2, "year":1901}]
            }
        ],

        "scales": [
            {
                "name": "x",
                "type": "point",
                "range": "width",
                "domain": {"data": "table", "field": "year"}
            },
            {
                "name": "y",
                "type": "linear",
                "range": "height",
                "nice": true,
                "zero": true,
                "domain": {"data": "table", "field": "value"}
            }
        ],

        "axes": [
            {
                "orient": "bottom", 
                "scale": "x", 
                "labelAngle":-45, 
                "labelAlign":"right", 
                "labelOverlap":false,
                "grid":true,
                "encode":{
                    "grid":{
                        "update":{
                            "stroke":{"signal":"datum.value % 10 == 0 ? '#333333' : '#eeeeee'"}
                        }
                    }
                }
            },
            {"orient": "left", "scale": "y", "grid":true, "format":",.0%"}
        ],

        "marks": [

            {
                "type": "line",
                "from": {"data": "table"},
                "encode": {
                    "enter": {
                        "stroke": {"value":"#00649F"},
                        "strokeWidth": {"value": 3},
                        "interpolate": {"value": "linear"},
                        "strokeOpacity": {"value": 1},
                        "strokeCap": {"value":"round"},
                        "strokeJoin": {"value":"round"}
                    },
                    "update": {
                        "x": {"scale": "x", "field": "year"},
                        "y": {"scale": "y", "field": "value"},
                        "defined": {"signal":"datum.value != null"}
                    }
                }
            }
        ]

    }
}

export default TrendLine;