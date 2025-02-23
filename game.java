import java.util.Random;
import java.util.Scanner;

public class BusGame {
    private static final int START_TIME_HOUR = 6; // 6:00 AM
    private static final int MAX_TIME_HOUR = 18; // 6:00 PM
    private static final int START_BUDGET = 50; // $50 starting budget
    private static final int WIN_DISTANCE = 100; // 100 km to win

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        // Initialize player and game state
        System.out.print("Enter your name: ");
        String playerName = scanner.nextLine();
        Player player = new Player(playerName, START_BUDGET);
        Time currentTime = new Time(START_TIME_HOUR, 0);
        String[] stops = {"Aberdeen", "Hilton", "Ellon"};

        // Game loop
        while (true) {
            for (String stop : stops) {
                player.setCurrentStop(stop);
                System.out.println("\n--- Arriving at " + stop + " ---");
                currentTime = checkStop(player, currentTime, scanner, random);
                tellTime(currentTime);

                if (currentTime.getHour() >= MAX_TIME_HOUR || player.getBudget() <= 0) {
                    System.out.println("Game Over! You ran out of " + 
                        (currentTime.getHour() >= MAX_TIME_HOUR ? "time" : "money") + ".");
                    scanner.close();
                    return;
                }
                if (player.getTotalDistance() >= WIN_DISTANCE) {
                    System.out.println("Congratulations, " + player.getName() + "! You traveled " +
                        player.getTotalDistance() + " km and won the game!");
                    scanner.close();
                    return;
                }
            }
        }
    }

    public static void tellTime(Time time) {
        System.out.println("Current time: " + time);
    }

    public static Time checkStop(Player player, Time time, Scanner scanner, Random random) {
        int hour = time.getHour();
        System.out.println("You have arrived at " + player.getCurrentStop() + " at " + time +
            " with $" + player.getBudget() + " remaining.");

        int numberOfBuses = hour < 10 ? 3 : hour < 14 ? 2 : 1;
        return generateRandomBuses(numberOfBuses, time, player, scanner, random);
    }

    public static Time generateRandomBuses(int numberOfBuses, Time time, Player player, 
                                          Scanner scanner, Random random) {
        Bus[] buses = new Bus[numberOfBuses];
        int baseDistance = random.nextInt(20) + 10; // 10-30 km per trip

        // Generate buses with random attributes
        for (int i = 0; i < numberOfBuses; i++) {
            String busName = "Bus " + (char) ('A' + i);
            int duration = random.nextInt(46) + 15; // 15-60 minutes
            int price = (random.nextInt(4) + 1) * 5; // $5-$20
            buses[i] = new Bus(busName, duration, price);
        }

        // Random event (10% chance)
        if (random.nextInt(10) == 0) {
            System.out.println("Random Event: Bus delay! All durations increased by 15 minutes.");
            for (Bus bus : buses) bus.addDuration(15);
        } else if (random.nextInt(10) == 1) {
            System.out.println("Random Event: Discount! All prices halved.");
            for (Bus bus : buses) bus.setPrice(bus.getPrice() / 2);
        }

        // Display bus options
        System.out.println("Available buses at " + player.getCurrentStop() + ":");
        for (int i = 0; i < buses.length; i++) {
            System.out.println((i + 1) + ". " + buses[i]);
        }

        // Player chooses a bus
        int pChoice;
        while (true) {
            System.out.print("Choose a bus (1-" + buses.length + ") or 0 to wait 30 min: ");
            if (scanner.hasNextInt()) {
                pChoice = scanner.nextInt();
                if (pChoice == 0) {
                    System.out.println("You wait 30 minutes.");
                    return time.addMinutes(30);
                }
                if (pChoice >= 1 && pChoice <= buses.length) {
                    Bus chosenBus = buses[pChoice - 1];
                    if (player.getBudget() >= chosenBus.getPrice()) {
                        player.spend(chosenBus.getPrice());
                        player.addDistance(baseDistance);
                        System.out.println("You chose: " + chosenBus + " (" + baseDistance + " km)");
                        return time.addMinutes(chosenBus.getDuration());
                    } else {
                        System.out.println("Not enough money! $" + player.getBudget() + 
                            " left, need $" + chosenBus.getPrice() + ".");
                    }
                }
            }
            scanner.nextLine(); // Clear invalid input
            System.out.println("Invalid choice. Try again.");
        }
    }
}

// Player class to track state
class Player {
    private String name;
    private int budget;
    private String currentStop;
    private int totalDistance;

    public Player(String name, int budget) {
        this.name = name;
        this.budget = budget;
        this.totalDistance = 0;
    }

    public String getName() { return name; }
    public int getBudget() { return budget; }
    public String getCurrentStop() { return currentStop; }
    public int getTotalDistance() { return totalDistance; }
    public void setCurrentStop(String stop) { this.currentStop = stop; }
    public void spend(int amount) { this.budget -= amount; }
    public void addDistance(int distance) { this.totalDistance += distance; }
}

// Time class for realistic time handling
class Time {
    private int hour;
    private int minute;

    public Time(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
        normalize();
    }

    public int getHour() { return hour; }
    public int getMinute() { return minute; }

    public Time addMinutes(int minutes) {
        return new Time(hour, minute + minutes);
    }

    private void normalize() {
        hour += minute / 60;
        minute %= 60;
        hour %= 24;
        if (minute < 0) {
            minute += 60;
            hour -= 1;
        }
        if (hour < 0) hour += 24;
    }

    @Override
    public String toString() {
        String period = hour < 12 ? "AM" : "PM";
        int displayHour = hour % 12 == 0 ? 12 : hour % 12;
        return String.format("%d:%02d %s", displayHour, minute, period);
    }
}

// Bus class with proper encapsulation
class Bus {
    private String name;
    private int duration; // in minutes
    private int price;

    public Bus(String name, int duration, int price) {
        this.name = name;
        this.duration = duration;
        this.price = price;
    }

    public int getDuration() { return duration; }
    public int getPrice() { return price; }
    public void addDuration(int minutes) { this.duration += minutes; }
    public void setPrice(int price) { this.price = price; }

    @Override
    public String toString() {
        return name + " (Duration: " + duration + " min, Price: $" + price + ")";
    }
}
