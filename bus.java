import java.util.Random;

/**
 * Represents a bus with detailed attributes and behaviors for simulation.
 */
public class Bus {
    private String name;           // Bus identifier (e.g., "Bus A")
    private int durationMinutes;   // Travel duration in minutes
    private int price;             // Ticket price in dollars
    private int capacity;          // Passenger capacity
    private double delayRisk;      // Delay probability (0.0 to 100.0)
    private double fuelEfficiency; // Fuel efficiency in km per liter
    private final int id;          // Unique bus identifier
    private static int totalBuses = 0; // Static counter for all buses created
    private static final Random random = new Random(); // Shared Random instance

    /**
     * Constructs a Bus with specified attributes.
     * @param name Bus name
     * @param durationMinutes Duration in minutes
     * @param price Price in dollars
     * @param capacity Passenger capacity
     * @param delayRisk Delay risk percentage (0-100)
     * @param fuelEfficiency Fuel efficiency in km/liter
     */
    public Bus(String name, int durationMinutes, int price, int capacity, 
               double delayRisk, double fuelEfficiency) {
        setName(name);
        setDurationMinutes(durationMinutes);
        setPrice(price);
        setCapacity(capacity);
        setDelayRisk(delayRisk);
        setFuelEfficiency(fuelEfficiency);
        this.id = ++totalBuses; // Assign unique ID and increment counter
    }

    // Getters
    public String getName() { return name; }
    public int getDurationMinutes() { return durationMinutes; }
    public double getDurationHours() { return durationMinutes / 60.0; }
    public int getPrice() { return price; }
    public int getCapacity() { return capacity; }
    public double getDelayRisk() { return delayRisk; }
    public double getFuelEfficiency() { return fuelEfficiency; }
    public int getId() { return id; }
    public static int getTotalBuses() { return totalBuses; }

    // Setters with validation
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        this.name = name.trim();
    }

    public void setDurationMinutes(int durationMinutes) {
        if (durationMinutes < 0) {
            throw new IllegalArgumentException("Duration cannot be negative");
        }
        this.durationMinutes = durationMinutes;
    }

    public void setPrice(int price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }

    public void setCapacity(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        this.capacity = capacity;
    }

    public void setDelayRisk(double delayRisk) {
        if (delayRisk < 0 || delayRisk > 100) {
            throw new IllegalArgumentException("Delay risk must be between 0 and 100");
        }
        this.delayRisk = delayRisk;
    }

    public void setFuelEfficiency(double fuelEfficiency) {
        if (fuelEfficiency <= 0) {
            throw new IllegalArgumentException("Fuel efficiency must be positive");
        }
        this.fuelEfficiency = fuelEfficiency;
    }

    /**
     * Calculates cost efficiency as price per kilometer, assuming duration 
     * correlates with distance (1 hour = 50 km).
     * @return Cost per kilometer
     */
    public double calculateCostEfficiency() {
        double distanceKm = getDurationHours() * 50; // Arbitrary: 50 km/hour
        if (distanceKm == 0) return Double.POSITIVE_INFINITY;
        return price / distanceKm;
    }

    /**
     * Simulates a random delay based on delayRisk, adding 0-30 minutes.
     * @return New duration after applying delay (if any)
     */
    public int applyRandomDelay() {
        if (random.nextDouble() * 100 < delayRisk) {
            int delayMinutes = random.nextInt(31); // 0-30 minutes delay
            this.durationMinutes += delayMinutes;
            return durationMinutes;
        }
        return durationMinutes;
    }

    /**
     * Returns a formatted string representation of the bus.
     */
    @Override
    public String toString() {
        return String.format(
            "Bus #%d: %s | Duration: %.2f hr (%d min) | Price: $%d | " +
            "Capacity: %d | Delay Risk: %.1f%% | Fuel Eff.: %.1f km/L",
            id, name, getDurationHours(), durationMinutes, price, 
            capacity, delayRisk, fuelEfficiency
        );
    }
}
