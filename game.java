public class game{
    public static void main(String[] args) {
        int pchoice = (int)(Math.random() * 2) + 1;
        int time = 6;
        System.out.println("you have to get to london by 10:00, its 6:00");
        System.out.println(" you are at the bus  stop you can choose to either'1' for busA which takes 2 hours or '2' for busB which takes 4 hours");
        int busA = 2;
        int busB = 4;
        
        if (pchoice == 1){
            System.err.println("you chose busA ");
            time =time+ busA;
            System.out.println("you arrived halfway by "+ time+ " "+" oclock do you want to eat before you leave");
        }else if (pchoice == 2){
            System.err.println("you chose busB");
            time = time + busB;
            System.out.println("you arrived halfway by "+ time + " " + " oclock do you want to eat before you leave");
        }

 
    }
    public static int WasteTime(int wasteType){
        int time = 0;
        time = time + wasteType;
        return time;
    }

}