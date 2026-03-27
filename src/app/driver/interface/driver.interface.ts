export interface Driver {

    _id?: string;          
    name: string;
    email: string;
    password: string;
    role: string;
    racingNumber: number;
    nationality: string;
    driverImage?: URL;
    driverTeam: string;
    driverDES?: string;
    wins: number;
    podiums: number;
    driverWC: number;
    dob?: Date;
    dateJoined?: Date;
    lastUpdate?: Date;
}
