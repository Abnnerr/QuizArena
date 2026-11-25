import { RoomContext } from "../RoomContext";

const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    
    return (
        <RoomContext.Provider value={{}}>
            {children}
        </RoomContext.Provider>
    );
}

export default RoomProvider;