import java.util.Random;
import java.util.Scanner;

public class game {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int time = 6; // Start at 6 AM
        String stop;

        // Go through different stops and update time
        time = checkStop("Aberdeen", time, scanner);
        tellTime(time);

        time = checkStop("Hilton", time, scanner);
        tellTime(time);

        time = checkStop("Ellon", time, scanner);
        tellTime(time);
        
        scanner.close();
    }

    public static void tellTime(int time) {
        System.out.println("The time is " + time + ":00");
    }

    public static int checkStop(String stop, int time, Scanner scanner) {
        if (time < 10) {
            System.out.println("You have arrived at " + stop + " by " + time + ":00");
            return generateRandomBuses(3, time, stop, scanner);
        } else if (time < 14) {
            System.out.println("You have arrived at " + stop + " by " + time + ":00");
            return generateRandomBuses(2, time, stop, scanner);
        } else if (time < 18) {
            System.out.println("You have arrived at " + stop + " by " + time + ":00");
            return generateRandomBuses(1, time, stop, scanner);
        } else {
            System.out.println("You have failed, you are too late.");
            return time;
        }
    }

    public static int generateRandomBuses(int numberOfBuses, int time, String stop, Scanner scanner) {
        Random random = new Random();
        bus[] buses = new bus[numberOfBuses];

        for (int i = 0; i < numberOfBuses; i++) {
            String busName = "bus " + (char) ('a' + i);
            int duration = random.nextInt(4) + 1; // Duration between 1 and 4 hours
            int price = (random.nextInt(10) + 1) * 5; // Price between $5 and $50 (multiples of 5)

            buses[i] = new bus(busName, duration, price);
        }

        System.out.println("At " + stop + ", you can choose from the following buses:");
        for (int i = 0; i < buses.length; i++) {
            System.out.println((i + 1) + ". " + buses[i]);
        }

        // Asking the player to choose a bus
        int pChoice;
        while (true) {
            System.out.print("Enter the number of your chosen bus (1-" + buses.length + "): ");
            if (scanner.hasNextInt()) {
                pChoice = scanner.nextInt();
                if (pChoice >= 1 && pChoice <= buses.length) {
                    break; // Valid choice
                }
            }
            scanner.nextLine(); // Clear invalid input
            System.out.println("Invalid choice. Please enter a valid bus number.");
        }

        System.out.println("You have chosen: " + buses[pChoice - 1]);

        // Update time in HOURS
        return time + buses[pChoice - 1].getDuration();
    }
}
22
