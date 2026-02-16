use dep::std;

fn main(
    zone_lat_min: pub Field,
    zone_lat_max: pub Field,
    zone_lon_min: pub Field,
    zone_lon_max: pub Field,
    current_time: pub Field,
    max_age: pub Field,
    user_lat: Field,
    user_lon: Field,
    user_time: Field
) {
    // Convert to u64 for comparison
    let user_lat_u64 = user_lat as u64;
    let zone_lat_min_u64 = zone_lat_min as u64;
    let zone_lat_max_u64 = zone_lat_max as u64;
    
    let user_lon_u64 = user_lon as u64;
    let zone_lon_min_u64 = zone_lon_min as u64;
    let zone_lon_max_u64 = zone_lon_max as u64;
    
    let current_time_u64 = current_time as u64;
    let user_time_u64 = user_time as u64;
    let max_age_u64 = max_age as u64;
    
    // Verify user is within zone
    assert(user_lat_u64 >= zone_lat_min_u64);
    assert(user_lat_u64 <= zone_lat_max_u64);
    assert(user_lon_u64 >= zone_lon_min_u64);
    assert(user_lon_u64 <= zone_lon_max_u64);
    
    // Verify timestamp is recent
    assert(current_time_u64 >= user_time_u64);
    let time_diff = current_time_u64 - user_time_u64;
    assert(time_diff <= max_age_u64);
}

#[test]
fn test_valid_location() {
    main(0, 100, 0, 100, 1000, 100, 50, 50, 950);
}

#[test(should_fail)]
fn test_invalid_lat() {
    main(0, 100, 0, 100, 1000, 100, 150, 50, 950);
}

#[test(should_fail)] 
fn test_stale_timestamp() {
    main(0, 100, 0, 100, 1000, 10, 50, 50, 500);
}
