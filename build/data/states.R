library(tidyverse)

#generate lookup table
states <- c("Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
            "Connecticut", "Delaware", "District of Columbia", "Florida", 
            "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
            "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", 
            "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
            "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
            "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
            "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
            "West Virginia", "Wisconsin", "Wyoming")
fips <- c("01", "02", "04", "05", "06", "08", "09", "10", "11", "12", 
          "13", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", 
          "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", 
          "36", "37", "38", "39", "40", "41", "42", "44", "45", "46", "47", 
          "48", "49", "50", "51", "53", "54", "55", "56")
alpha <- c("AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", 
           "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
           "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", 
           "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", 
           "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY")
region2 <- c("East South Central", "Pacific", "Mountain", "West South Central", 
            "Pacific", "Mountain", "New England", "South Atlantic", "South Atlantic", 
            "South Atlantic", "South Atlantic", "Pacific", "Mountain", "East North Central", 
            "East North Central", "West North Central", "West North Central", 
            "East South Central", "West South Central", "New England", "South Atlantic", 
            "New England", "East North Central", "West North Central", "East South Central", 
            "West North Central", "Mountain", "West North Central", "Mountain", 
            "New England", "Middle Atlantic", "Mountain", "Middle Atlantic", 
            "South Atlantic", "West North Central", "East North Central", 
            "West South Central", "Pacific", "Middle Atlantic", "New England", 
            "South Atlantic", "West North Central", "East South Central", 
            "West South Central", "Mountain", "New England", "South Atlantic", 
            "Pacific", "South Atlantic", "East North Central", "Mountain")
region <- c("South", "West", "West", "South", "West", "West", "Northeast", 
                 "South", "South", "South", "South", "West", "West", "Midwest", 
                 "Midwest", "Midwest", "Midwest", "South", "South", "Northeast", 
                 "South", "Northeast", "Midwest", "Midwest", "South", "Midwest", 
                 "West", "Midwest", "West", "Northeast", "Northeast", "West", 
                 "Northeast", "South", "Midwest", "Midwest", "South", "West", 
                 "Northeast", "Northeast", "South", "Midwest", "South", "South", 
                 "West", "Northeast", "South", "West", "South", "Midwest", "West")

usps <- tibble(fips=fips, usps=alpha, name=states, region=region, region2=region2)

rm(states, fips, alpha, region, region2)
