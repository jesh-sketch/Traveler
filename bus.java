
// bus class definition
class bus {
    private String name;
    private int duration; // Duration in hours
    private int price;

    public bus(String name, int duration, int price) {
        this.name = name;
        this.duration = duration;
        this.price = price;
    }

    public int getDuration() {
        return duration;
    }

    @Override
    public String toString() {
        return name + " | Duration: " + duration + " hours | Price: $" + price;
    }
}