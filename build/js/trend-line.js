import {select, pointer} from 'd3-selection';
import {View, parse} from 'vega';

class TrendLine {
    dom = {container:null}
    width = 480;
    height = 220;

    constructor(container, is_bigchart, definition) {

        //edit the spec before parsing and creating the view
        if(!!is_bigchart){
            this.big_chart_mutable.value = true;
        }

        this.wrap =  select(container).append("div")
                                    .style("width","100%")
                                    .classed("flex-container",true)
                                    .classed("chart-wrapper",true)
                                    .classed("big-chart", this.big_chart_mutable.value);
        this.container = this.wrap.append("div").append("div").node();
        this.definition = this.wrap.append("div");
        this.view = new View(parse(this.vega_spec));
        this.view.initialize(this.container).renderer("svg").runAsync();
        this.view.resize();

        this.definition.html("<p>" + definition + "</p>")
 
    }

    clear(){
        
    }

    data(data_table){
        this.view.resize();
        this.view.data("table", data_table).runAsync();
        return this;
    }

    signal(signal_name, value){
        this.view.resize();
        this.view.signal(signal_name, value).runAsync();
    }

    //structured this way for ease of editing spec prior to initialization in the constructor above
    big_chart_mutable = {
        "name":"bigchart",
        "value":false
    }

    vega_spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "State-level child poverty almanac",
        "autosize":{"type": "fit-x", "resize": false},
        "width": this.width,
        "height": this.height,
        "padding": {"top":0,"left":0,"right":0, "bottom":0},
        "layout":{
            "columns":1,
            "align":"none",
            "padding":{"row":0,"column":0}
        },
        "title":{
            "text":{"signal":"indicator_name"},
            "anchor":"start",
            "fontSize":15,
            "fontWeight":400,
            "offset":10,
            "limit":{"signal":"width"}
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
                "value": [780, 1024]
            },
            {
                "name": "is_narrow",
                "value": true,
                "update":"container_width < viewport_breaks[0]"
            },
            {
                "name":"width",
                "update": "container_width"
            },

            this.big_chart_mutable,

            {
                "name":"aspect",
                "value": 2,
                "update": "is_narrow ? (bigchart ? 2 : 2.5) : (bigchart ? 3 : 5)"
            },
            {
                "name":"chart_height",
                "update": "width / aspect"
            },
            {
                "name":"height",
                "update":"chart_height"
            },
            {
                "name":"indicator_name",
                "value":"Indicator"
            },
            {
                "name":"selected_state",
                "value":"N/A"
            }
        ],

        "data":[
            {
                "name": "table",
                "values": [{"value":1, "year":1900}, {"value":2, "year":1901}]
            },
            {
                "name": "y2020",
                "source": "table",
                "transform":[
                    {
                        "type":"filter",
                        "expr":"datum.year == 2020"
                    }
                ]
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
                "range": [{"signal":"chart_height"}, 0],
                "nice": true,
                "zero": true,
                "domain": {"data": "table", "field": "value"}
            },
            {
                "name":"stroke",
                "type":"ordinal",
                "domain":["US",{"signal":"selected_state"}],
                "range":["#007cc2", "#0a355b"]
            },
            {
                "name":"strokedash",
                "type":"ordinal",
                "domain":["US",{"signal":"selected_state"}],
                "range":[[2,2], null]                
            }
        ],

        "marks": [
            {
                "name": "g_title",
                "type": "group",
                "marks": []
            },
            {
                "name": "g_main",
                "type": "group",
                "encode": {
                    "update":{
                        "height": {"signal":"chart_height"},
                        "width":{"signal":"width"},
                        "x":{"value":0}
                    }
                },
                "marks": [
                    {
                        "type": "group",
                        "from": {
                            "facet":{
                                "name": "facet_table",
                                "data": "table",
                                "groupby": ["state_abbr","id"]
                            }
                        },
                        "marks": [
                            {
                                "type": "line",
                                "from": {"data": "facet_table"},
                                "encode": {
                                    "enter": {
                                        "interpolate": {"value": "monotone"},
                                        "strokeOpacity": {"value": 1},
                                        "strokeCap": {"value":"butt"},
                                        "strokeJoin": {"value":"round"}
                                    },
                                    "update": {
                                        "x": {"scale": "x", "field": "year"},
                                        "y": {"scale": "y", "field": "value"},
                                        "defined": {"signal":"datum.value != null"},
                                        "stroke": [
                                            {"test":"datum.state_abbr == 'US'", "value":"#007cc2"},
                                            {"value":"#0a355b"}
                                        ],
                                        "strokeWidth": {"value": 1.5},
                                        "strokeDash": [
                                            {"test":"datum.state_abbr == 'US'", "value":[2,2]},
                                            {"value":null}
                                        ]
                                    }
                                }
                            },
                            {
                                "type": "symbol",
                                "from": {"data": "facet_table"},
                                "encode": {
                                    "enter": {
                                    },
                                    "update": {
                                        "x": {"scale": "x", "field": "year"},
                                        "y": {"scale": "y", "field": "value"},
                                        "size": {"value":25},
                                        "fill": [
                                            {"test":"datum.state_abbr == 'US'", "value":"#007cc2"},
                                            {"value":"#0a355b"}
                                        ],
                                        "opacity": [
                                            {"test":"datum.state_abbr == 'US'", "value":0},
                                            {"value":1}
                                        ]
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "type":"text",
                        "from":{"data":"y2020"},
                        "endoce":{
                            "update":{
                                "x":{"value":2020, "scale":"x"},
                                "y":{"field":"value", "scale":"y"},
                                "text":{"value":"2020 anno."}
                            }
                        }

                    }
                ],
                "axes": [
                    {
                        "orient": "bottom", 
                        "scale": "x", 
                        "labelAngle":-45, 
                        "labelAlign":"right", 
                        "labelOverlap":false,
                        "grid":false,
                        "domain":false,
                        "ticks":false,
                        "offset":5,
                        "encode":{
                            "grid":{
                                "update":{
                                    "stroke":{"signal":"datum.value % 10 == 0 ? '#dddddd' : '#ffffff'"},
                                    "strokeWidth":{"value":1}
                                }
                            },
                            "labels":{
                                "update":{
                                    "text":[
                                        {"test":"is_narrow", "signal": 'datum.value % 10 == 0 ? datum.value : ""'},
                                        {"signal": 'datum.value % 10 == 0 ? datum.value : "\'" + substring(toString(datum.value),2)'}
                                    ],
                                    "angle":{"signal":"is_narrow ? 0 : -45"},
                                    "align":{"signal":"is_narrow ? 'center' : 'right'"},
                                }
                            }
                        }
                    },
                    {
                        "orient": "left",
                        "scale": "y", 
                        "grid":true, 
                        "domain":false, 
                        "format":",.0f", 
                        "tickCount":4, 
                        "ticks":false, 
                        "offset":5,
                        "encode":{
                            "grid":{
                                "update":{
                                    "stroke":{"signal":"datum.value === 0 ? '#333333' : '#dddddd'"},
                                    "strokeWidth":{"value":1}
                                }
                            }
                        }
                    }
                ],
                "legends": [
                    {
                      "orient": "bottom",
                      "stroke":"stroke",
                      "values": ["US", {"signal":"selected_state"}],
                      "symbolType": "stroke",
                      "encode":{
                        "symbols":{
                            "update":{
                                "strokeDash": {"field":"value", "scale":"strokedash"}
                            }
                        }
                      }
                    }
                  ],
            },
            {
                "name": "g_footer",
                "type": "group",
                "marks": []
            }
        ]

    }
}

export default TrendLine;