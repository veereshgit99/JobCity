"""Top US cities with lat/lng — bundled so we never need an external geocoder."""
US_CITIES = {
    # (city, state): (lat, lng)
    ("Seattle", "WA"): (47.6062, -122.3321),
    ("Portland", "OR"): (45.5152, -122.6784),
    ("San Francisco", "CA"): (37.7749, -122.4194),
    ("San Jose", "CA"): (37.3382, -121.8863),
    ("Los Angeles", "CA"): (34.0522, -118.2437),
    ("San Diego", "CA"): (32.7157, -117.1611),
    ("Las Vegas", "NV"): (36.1699, -115.1398),
    ("Phoenix", "AZ"): (33.4484, -112.0740),
    ("Denver", "CO"): (39.7392, -104.9903),
    ("Salt Lake City", "UT"): (40.7608, -111.8910),
    ("Austin", "TX"): (30.2672, -97.7431),
    ("Dallas", "TX"): (32.7767, -96.7970),
    ("Houston", "TX"): (29.7604, -95.3698),
    ("Atlanta", "GA"): (33.7490, -84.3880),
    ("Miami", "FL"): (25.7617, -80.1918),
    ("Orlando", "FL"): (28.5383, -81.3792),
    ("Chicago", "IL"): (41.8781, -87.6298),
    ("Detroit", "MI"): (42.3314, -83.0458),
    ("Minneapolis", "MN"): (44.9778, -93.2650),
    ("St. Louis", "MO"): (38.6270, -90.1994),
    ("Nashville", "TN"): (36.1627, -86.7816),
    ("Charlotte", "NC"): (35.2271, -80.8431),
    ("Raleigh", "NC"): (35.7796, -78.6382),
    ("Washington", "DC"): (38.9072, -77.0369),
    ("Philadelphia", "PA"): (39.9526, -75.1652),
    ("New York", "NY"): (40.7128, -74.0060),
    ("Boston", "MA"): (42.3601, -71.0589),
    ("Pittsburgh", "PA"): (40.4406, -79.9959),
    ("Columbus", "OH"): (39.9612, -82.9988),
    ("Indianapolis", "IN"): (39.7684, -86.1581),
}


def lookup(city: str, state: str):
    return US_CITIES.get((city, state))
