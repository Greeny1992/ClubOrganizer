class ServerConfig {
    private _host = "http://localhost:5010/api";
    private _loginURI = `${this._host}/User/Login`;
    private _EventURI = `${this._host}/Club/CreateEventForClub/`;
    private _GroupURI = `${this._host}/Club/CreateGroupForClub/`;
    private _ClubURI = `${this._host}/Club/`;
    private _UserURI = `${this._host}/User/`;

    public get host(): string {
        return this._host
    };

    public get loginURI(): string {
        return this._loginURI
    };

    public get getClubControllerURI(): string {
        return this._ClubURI
    };

    public get getEventControllerURI(): string {
        return this._EventURI
    };

    public get getGroupControllerURI(): string {
        return this._GroupURI
    };

    public get getUserURI(): string {
        return this._UserURI
    };



}

export default new ServerConfig()