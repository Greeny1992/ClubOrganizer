using Context.DAL;

namespace Context.Repos
{
    public interface IUserRepository : IMongoRepository<User>
    {

        Task<User> Login(String username, String password);

        Task<User> AddOrUpdateGroupsToUser(string userId, List<string> groupIds);


        Task<List<User>> ListMemberFromClub(string clubId);

    }
}
