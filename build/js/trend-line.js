import {select, pointer} from 'd3-selection';
import {View, parse} from 'vega';

class TrendLine {
    dom = {container:null}
    width = 480;
    height = 220;

    vega_font = "'Montserrat', sans-serif";
    vega_font_color = "#272727";
    vega_theme = {
        "text":{
            "font": this.vega_font,
            "fontSize":16,
            "fill":this.vega_font_color
            },
        "legend":{
            "layout":{"anchor": "start", "margin":40},
            "titleFontWeight": "700",
            "titleColor": this.vega_font_color,
            "labelColor": this.vega_font_color,
            "titleFont": this.vega_font,
            "titleFontSize": 16,
            "labelFont": this.vega_font,
            "labelFontSize": 16,
            "columnPadding":7,
            "rowPadding":7
            },
        "title":{
            "fontWeight":"normal",
            "font":this.vega_font,
            "fontSize":16,
            "fontWeight":400,
            "offset":10
        },
        "axis":{
            "labelFont": this.vega_font,
            "labelFontSize": 13,
            "labelColor": this.vega_font_color,
            "titleFont": this.vega_font,
            "titleColor": this.vega_font_color,
            "titleFontWeight":"normal",
            "titleFontSize":16,
            "titlePadding":10,
            "offset":10
        }
    }

    constructor(container, is_bigchart, definition) {

        //edit the spec before parsing and creating the view
        if(!!is_bigchart){
            this.big_chart_mutable.value = true;
        }

        this.wrap =  select(container).append("div")
                                    .classed("flex-container",true)
                                    .classed("chart-wrapper",true)
                                    .classed("big-chart", this.big_chart_mutable.value);
        this.container = this.wrap.append("div").append("div").node();
        this.definition = this.wrap.append("div");
        this.view = new View(parse(this.vega_spec, this.vega_theme));
        this.view.initialize(this.container).renderer("svg").runAsync();
        this.view.resize();

        this.definition.html("<p>" + definition + "</p>");

        //this.view.addSignalListener("isactive", (a,b) => console.log("Is active: " + b)); 
    }

    clear(){
        
    }

    data(data_table){
        this.view.resize();
        this.view.data("table", data_table);
        this.view.runAsync();
        return this;
    }

    signal(signal_name, value){
        this.view.resize();
        this.view.signal(signal_name, value);
        this.view.runAsync();
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
        "padding": {"top":0,"left":5,"right":5, "bottom":0},
        "layout":{
            "columns":1,
            "align":"none",
            "padding":{"row":0,"column":0}
        },
        "title":{
            "text":{"signal":"indicator_name"},
            "anchor":"start",
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
            {
                "name":"extra_pad",
                "value":0
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
            },
            {
                "name":"value_format",
                "value":",.1f"
            },
            {
                "name":"endyear",
                "value":2020
            },
            {
                "name":"scalerange",
                "value":[10,20],
                "update":"range('x_linear')"
            },
            {
                "name": "indexYear",
                "update": "endyear",
                "on": [
                  {
                    "events": "mousemove",
                    "update": "round(invert('x_linear', clamp(x('g_main'), scalerange[0], scalerange[1])))"
                  },
                  {
                    "events": "mouseout",
                    "update": "endyear"
                  }
                ]
            },
            {
                "name":"indexRule",
                "value":0,
                "update":"round(scale('x',indexYear))"
            },
            {
                "name":"yeardomain",
                "value":0,
                "update":"domain('x')"
            },
            {
                "name": "isactive",
                "value": false,
                "on": [
                  {
                    "events": "mouseover",
                    "update": "true",
                    "markname":"touchpad"
                  },
                  {
                    "events": "mousemove",
                    "update": "true",
                    "markname":"touchpad"
                  },
                  {
                    "events": "mouseout",
                    "update": "false",
                    "markname":"touchpad"
                  }
                ]
            }
        ],

        "data":[
            {
                "name": "table",
                "values": []
            },
            {
                "name": "anno_table",
                "source": "table",
                "transform":[
                    {
                        "type":"filter",
                        "expr":"datum.state_abbr != 'US' || selected_state == 'US'"
                    },
                    {
                        "type":"formula",
                        "expr":"format(datum.value, value_format)",
                        "as":"label"
                    }
                ]
            },
            {
                "name": "series_label",
                "source": "table",
                "transform":[
                    {
                        "type":"filter",
                        "expr":"datum.year == 1980 && (datum.state_abbr != 'US' || selected_state == 'US')"
                    },
                    {
                        "type":"filter",
                        "expr":"datum.id==='poverty' || datum.id==='deep_poverty' || datum.id==='low_income'"
                    },
                    {
                        "type":"formula",
                        "expr":"scale('labeler', datum.id)",
                        "as":"label"
                    }
                ]
            }
        ],

        "scales": [
            {
                "name": "x",
                "type": "point",
                "zero": false,
                "padding": 0,
                "range": [{"signal":"extra_pad"}, {"signal":"width-20"}],
                "domain": {"data": "table", "field": "year", "sort":true}
            },
            {
                "name": "x_linear",
                "type": "linear",
                "zero": false,
                "range": [{"signal":"extra_pad"}, {"signal":"width-20"}],
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
            },
            {
                "name":"labeler",
                "type":"ordinal",
                "domain":["low_income","poverty","deep_poverty"],
                "range":["Low income","Poverty","Deep poverty"]
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
                                        "size": {"signal":"isactive && datum.year == indexYear ? 60 : 25"},
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
                            },
                            {
                                "type": "rule",
                                "encode": {
                                    "update":{
                                        "x": {"signal":"indexRule", "offset":0.5},
                                        "x2": {"signal":"indexRule", "offset":0.5},
                                        "y": {"signal":"range('y')[0]"},
                                        "y2": {"signal":"range('y')[1]"},
                                        "stroke": {"value":"#0a355b"},
                                        "opacity": {"signal":"isactive ? 1 : 0"}
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "type":"text",
                        "name":"anno",
                        "from":{"data":"anno_table"},
                        "zindex":10,
                        "encode":{

                            "update":{
                                "fontWeight":{"value":"normal"},
                                "x":{"field":"year", "scale":"x"},
                                "y":{"field":"value", "scale":"y"},
                                "opacity":{"signal":"datum.year == indexYear ? 1 : 0"},
                                "text":{"signal":"datum.label"},
                                "baseline":{"value":"middle"},
                                "align":{"signal":"datum.year == 1980 ? 'left' : 'left'"},
                                "dx":{"signal":"datum.year == 1980 ? 6 : 6"},
                                "dy":{"signal":"datum.year == 1980 ? -2 : -2"},
                                "angle":{"signal":"datum.year == 1980 ? -33 : -33"}
                            }
                        }
                    },
                    {
                        "type":"text",
                        "from":{"data":"anno"},
                        "zindex":9,
                        "encode":{
                            "update":{
                                "fontWeight":{"field":"fontWeight"},
                                "x":{"field":"x"},
                                "y":{"field":"y"},
                                "opacity":{"field":"opacity"},
                                "text":{"field":"text"},
                                "baseline":{"field":"baseline"},
                                "align":{"field":"align"},
                                "angle":{"field":"angle"},
                                "dx":{"field":"dx"},
                                "dy":{"field":"dy"},
                                "fill":{"value":"#ffffff"},
                                "stroke":{"value":"#ffffff"},
                                "strokeWidth":{"value":2}
                            }
                        }
                    },
                    {
                        "type":"text",
                        "name":"anno_series",
                        "from":{"data":"series_label"},
                        "zindex":10,
                        "encode":{

                            "update":{
                                "fontWeight":{"value":"normal"},
                                "fontSize":{"value":13},
                                "x":{"field":"year", "scale":"x"},
                                "y":{"field":"value", "scale":"y"},
                                "text":{"signal":"datum.label"},
                                "baseline":{"value":"middle"},
                                "align":{"value":"right"},
                                "dx":{"value":-6},
                                "dy":{"value":0},
                                "angle":{"value":0}
                            }
                        }
                    },
                    {
                        "type":"text",
                        "from":{"data":"anno_series"},
                        "zindex":9,
                        "encode":{
                            "update":{
                                "fontWeight":{"field":"fontWeight"},
                                "fontSize":{"field":"fontSize"},
                                "x":{"field":"x"},
                                "y":{"field":"y"},
                                "text":{"field":"text"},
                                "baseline":{"field":"baseline"},
                                "align":{"field":"align"},
                                "angle":{"field":"angle"},
                                "dx":{"field":"dx"},
                                "dy":{"field":"dy"},
                                "fill":{"value":"#ffffff"},
                                "stroke":{"value":"#ffffff"},
                                "strokeWidth":{"value":2}
                            }
                        }
                    },
                    {
                        "name":"touchpad",
                        "type":"rect",
                        "zindex":100,
                        "encode":{
                            "enter":{
                                "fillOpacity":{"value":0}
                            },
                            "update":{
                                "width":{"signal":"width"},
                                "height":{"signal":"height"},
                                "x":{"value":0},
                                "y":{"value":0}
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
                                        {"test":"isactive && datum.value == indexYear", "signal":"datum.value"},
                                        {"test":"is_narrow", "signal": 'datum.value % 10 == 0 ? datum.value : ""'},
                                        {"signal": 'datum.value % 10 == 0 ? datum.value : "\'" + substring(toString(datum.value),2)'}
                                    ],
                                    "opacity":[
                                        {"test":"isactive && datum.value !== indexYear", "value":0},
                                        {"value":1}
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
                        "offset":0,
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
                      "direction":"horizontal",
                      "values": ["US", {"signal":"selected_state"}],
                      "symbolType": "stroke",
                      "symbolSize":300,
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