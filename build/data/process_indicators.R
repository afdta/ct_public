library(tidyverse)
library(readxl)
library(jsonlite)
    
#NEED A GEO LOOKUP


#METADATA
##NEED A META DATA FILE WITH INDICATOR DEFS
source("~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/build/data/states.R")


pulltab <- function(tabname, varid){
  id <- enquo(varid)
  xl_ <- "~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/build/data/avg3year.xlsx" 
  xl <- read_xlsx(xl_, sheet=tabname)
  cat("Pulled '"); cat(tabname); cat("'\nObs: "); cat(nrow(xl)); cat("\nVars: "); cat(names(xl)); cat("\n------------------------\n\n");
  
  l <- xl %>% pivot_longer(cols='1980':'2020', names_to='year_c') %>% 
    mutate(year=as.numeric(year_c), id=!!id) %>% 
    split(., .$state_abbr)
  return(l)
} 

all_data <- list()

all_data$poverty <- pulltab("SPM In Poverty", "poverty")
all_data$low_income <- pulltab("SPM Low Income", "low_income")
all_data$deep_poverty <- pulltab("SPM Deep Poverty", "deep_poverty")
all_data$gdp_pc <- pulltab("GDP per capita", "gdp_pc")
all_data$median_wage <- pulltab("Median Wage", "median_wage")
all_data$inequality <- pulltab("Inequality", "inequality")

all_data$urate <- pulltab("Unemployment", "urate")
all_data$f_lfp <- pulltab("FLFP", "f_lfp")
all_data$edu <- pulltab("Education", "edu")
all_data$parent_01 <- pulltab("Zero or One Parent", "parent_01")
all_data$teen_birth <- pulltab("Teen Birth", "teen_birth")
all_data$pov_reduction <- pulltab("Reduction SSN", "pov_reduction")

write_json(all_data, "~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/assets/all_data.json", digits=5, pretty=TRUE, na="null")

metadata <- list(
  allvars = c("poverty_x3","gdp_pc", "median_wage","inequality", "urate", "f_lfp", "edu", "parent_01", "teen_birth", "pov_reduction"),
  varnames = list(poverty_x3="Poverty levels",
                  poverty="In poverty",
                  low_income="Los income",
                  deep_poverty="Deep poverty",
                  gdp_pc="GDP per capita", 
                  median_wage="Median wage",
                  inequality="Wage inequality",
                  urate="Unemployment rate",
                  f_lfp="Female labor force participation rate", 
                  edu="Share of population with HS degree", 
                  parent_01="Share of children living with less than two parents", 
                  teen_birth="Teen birth rate",
                  pov_reduction="Poverty reduction"),
  definitions = list(poverty_x3="<b>Three poverty levels</b><br />Children in households with resources below 100% of the Supplemental Poverty Measure (SPM) threshold are considered to live “in poverty.” Children below 50% of the threshold are considered “in deep poverty.” Children below 200% of the threshold are considered in “low-income” families.",
                     poverty="In poverty",
                     low_income="Low-income",
                     deep_poverty="Deep poverty",
                     gdp_pc="<b>Gross Domestic Product (GDP) per capita</b> is the state’s GDP divided by its population. All estimates are in 2019 dollars. <br /><br /><i>Source: <a href='https://fred.stlouisfed.org/categories/27281'>FRED</a></i>", 
                     median_wage="<b>Real median wage</b> is the wage at the 50th percentile of the state’s income distribution. Estimates are in 2019 dollars. <br /><br /><i>Source: Constructed from <a href='https://www.nber.org/research/data/current-population-survey-cps-merged-outgoing-rotation-group-earnings-data'>CPS MORG</a> data.</i>",
                     inequality="<b>Wage inequality</b> is the ratio of wages in the 90th percentile of the wage distribution to those in the 10th percentile. <br /><br /><i>Source: Constructed from <a href='https://www.nber.org/research/data/current-population-survey-cps-merged-outgoing-rotation-group-earnings-data'>CPS MORG</a> data</i>",
                     urate="<b>The unemployment rate</b> is the percentage of the labor force ages 16 and older that is unemployed and looking for a job. <br /><br /><i>Source: <a href='https://www.bls.gov/sae/'>BLS</a>.</i>",
                     f_lfp="<b>Female labor force participation</b> is the percentage of women ages 16-64 who are employed or looking for work. <br /><br /><i>Source: <a href='https://www.bls.gov/opub/reports/womens-databook/2020/home.htm'>BLS</a></i>", 
                     edu="<b>Share of population with a high school degree</b> is the percentage of the population ages 25 and older with at least a high school degree or the equivalent. <br /><br /><i>Source: Constructed from <a href='https://cps.ipums.org/cps/'>CPS-ASEC</a> data.</i>", 
                     parent_01="<b>Share of children living with less than two parents</b> is the percentage of children from birth to age 17 who live with one or no parents. <br /><br /><i>Source: Constructed from <a href='https://cps.ipums.org/cps/'>CPS-ASEC</a> data.</i>",
                     teen_birth="<b>Teen birth rate</b> is the number of births per 1,000 females ages 15-19. <br /><br /><i>Source: <a href='https://www.cdc.gov/nchs/data_access/VitalStatsOnline.htm'>Center for Disease Control</a>.</i>",
                     pov_reduction="The social safety net plays an important role in reducing child poverty. We present the percentage point reduction in child poverty rates after including the cash value of federal tax and transfer programs, over time, holding all else equal and assuming no behavioral changes. <br /><br /><i>Source: <a href=''>...</a>.</i>"),
  states = usps
)

write_json(metadata, "~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/assets/metadata.json", digits=5, pretty=TRUE, na="null", auto_unbox=TRUE)


#all <- read_xlsx("~/Projects/Brookings/covid-19-tracker/build/data/COVID-19 Economic Tracker 2022 - All Indicators.xlsx", sheet="All Indicators", range="A5:AX196", col_names=paste0("v",1:50)) %>%


