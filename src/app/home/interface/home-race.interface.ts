export interface JolpicaRaceResponse {
  MRData: {
    RaceTable: {
      Races: JolpicaRace[];
    };
  };
}

export interface JolpicaRace {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  Results?: JolpicaRaceResult[];
}

export interface JolpicaRaceResult {
  position: string;
  points: string;
  status: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    code?: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
  Time?: {
    time: string;
  };
}
