import type { Prisma } from "@prisma/client";

export type RoomWithPlayers = Prisma.RoomsGetPayload<{
  include: {
    roomPlayers: {
      select: {
        players: true,
        ready: true
      }
    };
  };
}>;