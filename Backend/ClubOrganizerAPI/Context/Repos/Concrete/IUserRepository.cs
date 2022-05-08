using Context.DAL;

namespace Context.Repos
{
    public interface IUserRepository : IMongoRepository<User>
    {

        Task<User> Login(String username, String password);

    }
}
