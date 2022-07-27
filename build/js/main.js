import TrendLine from "./trend-line.js";
import { json } from "d3";
import url from "./url.js";
import { select } from "d3";

(function(){

    let meta = json(url.assets + "metadata.json");
    let alldata = json(url.assets + "all_data.json");
    let container = select("#chart-wrapper").append("div").attr("class","flex-container flex-50");
    
    let current_state = "AL";
    let charts = [];

    Promise.all([meta, alldata]).then(md => {
        let META = md[0];
        let DATA = md[1];

        META.allvars.forEach(v => {
            let chart = new TrendLine(container.node(), v==="poverty_x3" || v==="pov_reduction", META.definitions[v]);

            charts.push({
                indicator: v,
                chart: chart
            })
        });

        function update(){
            charts.forEach(pkg => {
                let state = [];
                let us = [];

                if(pkg.indicator == "poverty_x3"){
                    state = (DATA.poverty[current_state]).concat(DATA.low_income[current_state], DATA.deep_poverty[current_state]);
                    us = (DATA.poverty.US).concat(DATA.low_income.US, DATA.deep_poverty.US);
                }
                else{
                    state = DATA[pkg.indicator][current_state];
                    us = DATA[pkg.indicator].US;
                }

                pkg.chart.data(us.concat(state));
                pkg.chart.signal("indicator_name",META.varnames[pkg.indicator]);
                pkg.chart.signal("selected_state", current_state);
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

