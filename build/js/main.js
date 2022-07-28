import TrendLine from "./trend-line.js";
import { json } from "d3";
import url from "./url.js";
import { select } from "d3";

(function(){

    let meta = json(url.assets + "metadata.json");
    let alldata = json(url.assets + "all_data.json");
    let container0 = select("#chart-wrapper");
    
    let container1 = container0.append("div").attr("class","flex-container flex-50");
    let container2 = container0.append("div").attr("class","flex-container flex-50");
    let container3 = container0.append("div").attr("class","flex-container flex-50");
    
    container2.append("div").classed("full-span",true)
        .html("<h2>Economic, labor market, and demographic trends that may be related to changes in child poverty</h2>")

    container3.append("div").classed("full-span",true)
        .html("<h2>Trends in the role of the social safety net in reducing child poverty</h2>")

    let current_state = "AL";
    let charts = [];

    Promise.all([meta, alldata]).then(md => {
        let META = md[0];
        let DATA = md[1];

        META.allvars.forEach(v => {
            let node = container2.node();
            let big_chart = false;
            if (v==="pov_reduction"){
                node = container3.node();
                big_chart = true;
            }
            else if (v==="poverty_x3"){
                node = container1.node();
                big_chart = true;
            }

            let chart = new TrendLine(node, big_chart, META.definitions[v]);

            charts.push({
                indicator: v,
                chart: chart
            })
        });

        function update(){
            charts.forEach(pkg => {
                let state = [];
                let us = [];
                let extra_pad = 0;

                if(pkg.indicator == "poverty_x3"){
                    state = (DATA.poverty[current_state]).concat(DATA.low_income[current_state], DATA.deep_poverty[current_state]);
                    us = (DATA.poverty.US).concat(DATA.low_income.US, DATA.deep_poverty.US);
                    extra_pad = 70;
                }
                else{
                    state = DATA[pkg.indicator][current_state];
                    us = DATA[pkg.indicator].US;
                }

                pkg.chart.data(us.concat(state));
                pkg.chart.signal("indicator_name",META.varnames[pkg.indicator]);
                pkg.chart.signal("selected_state", current_state);
                pkg.chart.signal("extra_pad", extra_pad);
            })
        }

        //initialize
        update();

        let controls = select("#controls");
        let dropdown = controls.append("select").style("font-size","18px").style("padding","5px 10px");
        dropdown.selectAll("option").data(META.states)
                .join("option").text(d=>d.name).attr("value",d=>d.usps);

        dropdown.append("option").text("United States").attr("value","US");

        dropdown.on("change",function(){
            current_state = this.value;
            update();
        });
    })

    
})();

