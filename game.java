//import java.util.Scanner;

public class game{
    public static void main(String[] args) {
        //Scanner scanner = new Scanner(System.in);
        //int pchoice = scanner.nextInt();
        int pchoice = (int)(Math.random() * 2) + 1;
        int time = 6;
        System.out.println("you have to get to london by 10:00, its 6:00");
        System.out.println(" you are at the bus  stop you can choose to either'1' for busA which takes 2 hours or '2' for busB which takes 4 hours");
        int busA = 2;
        int busB = 4;
        int eat = 1;
        if (pchoice == 1){
            System.err.println("you chose busA ");
            time =time+ busA;
            System.out.println("you arrived halfway by "+ time+ " "+" oclock do you want to eat before you leave 1 for yes 2 for no");
        }else if (pchoice == 2){
            System.err.println("you chose busB");
            time = time + busB;
            System.out.println("you arrived halfway by "+ time + " " + " oclock do you want to eat before you leave 1 for yes, 2 for no");
        }
        //pchoice 
        pchoice = (int)(Math.random() * 2) + 1;
        if(pchoice == 1){
            System.err.println("you chose to wait and eat. the time is"+ WasteTime(eat , time));
        }else if(pchoice == 2){
            System.err.println("you chose to wait and eat. the time is"+ time);
        }
        

 
    }
    public static int WasteTime(int wasteType, int time){
        time = time + wasteType;
        return time;
    }

}