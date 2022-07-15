library(tidyverse)
library(readxl)
library(jsonlite)
    
#NEED A GEO LOOKUP


#METADATA
##NEED A META DATA FILE WITH INDICATOR DEFS



pulltab <- function(tabname, varid){
  id <- enquo(varid)
  xl_ <- "~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/build/data/state_nat_1980_2020_draft.xlsx" 
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

write_json(all_data, "~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/assets/all_data.json", digits=5, pretty=TRUE, na="null")

metadata <- list(
  allvars = c("poverty_x3","gdp_pc", "median_wage","inequality", "urate", "f_lfp", "edu", "parent_01", "teen_birth"),
  varnames = list(poverty_x3="Poverty levels",
                  poverty="In poverty",
                  low_income="Los income",
                  deep_poverty="Deep poverty",
                  gdp_pc="GDP per capita", 
                  median_wage="Median wage",
                  inequality="Inequality",
                  urate="Unemployment rate",
                  f_lfp="Female labor force participation rate", 
                  edu="Percengate of population... (what is edu var)?", 
                  parent_01="Single parent (0 or 1)", 
                  teen_birth="Teen birth rate")
)

write_json(metadata, "~/Projects/DistrictAnalytics/child_trends/state-poverty-tool/assets/metadata.json", digits=5, pretty=TRUE, na="null", auto_unbox=TRUE)


#all <- read_xlsx("~/Projects/Brookings/covid-19-tracker/build/data/COVID-19 Economic Tracker 2022 - All Indicators.xlsx", sheet="All Indicators", range="A5:AX196", col_names=paste0("v",1:50)) %>%


