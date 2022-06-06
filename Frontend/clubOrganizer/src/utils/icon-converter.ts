import {alarm, bed, car, flash, power, shieldCheckmark, sunnySharp, water} from "ionicons/icons";

export const IconConverter = (i : string) =>
{
    switch(i) {
        case "Temperature": {
            return water;
            break;
        }
        case "Climate": {
            return sunnySharp
            break;
        }
        case "Electrcity": {
            return flash
            break;
        }
        case "Car": {
            return car
            break;
        }
        case "Volt": {
            return power
            break;
        }
        case "Power": {
            return power
            break;
        }
        case "Check": {
            return shieldCheckmark
            break;
        }
        case "Alarm": {
            return alarm
            break;
        }
        case "OnOff": {
            return bed
            break;
        }
        default: {
            return water;
            break;
        }
    }
}