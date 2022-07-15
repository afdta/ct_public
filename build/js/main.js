import TrendLine from "./trend-line.js";
import { json } from "d3";
import url from "./url.js";
import { select } from "d3";

(function(){

    let meta = json(url.assets + "metadata.json");
    let alldata = json(url.assets + "all_data.json");
    let container = select("#chart-wrapper").append("div").attr("class","flex-container flex-50 first-100");
    
    let current_state = "AL";
    let charts = [];

    Promise.all([meta, alldata]).then(md => {
        let META = md[0];
        let DATA = md[1];

        META.allvars.forEach(v => {
            charts.push({
                indicator:v,
                chart: new TrendLine(container.node(), v==="poverty_x3")
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
            })
        }

        //initialize
        update();

        let dropdown = select("#controls").append("select");
        dropdown.selectAll("option").data(Object.entries(DATA.poverty).map(d=>d[0]))
                .join("option").text(t=>t).attr("value",v=>v);

        dropdown.on("change",function(){
            current_state = this.value;
            update();
        });
    })

    
})();

