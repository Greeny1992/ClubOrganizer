using Context.Repos;
using Context.Repos.Concrete;
using Context.Settings;
using Microsoft.Extensions.Configuration;

namespace Context.UnitOfWork
{
    public class MongoDBUnitOfWork
    {
        public MongoDBContext Context { get; private set; } = null;
        public MongoDBUnitOfWork()
        {
            var builder = new ConfigurationBuilder().SetBasePath(Utilities.Constants.CurrentFolder).AddJsonFile("appsettings.json");

            MongoDBSettings settings = builder.Build().GetSection("MongoDbSettings").Get<MongoDBSettings>();
            MongoDBContext context = new MongoDBContext(settings);
            Context = context;
        }

        public IUserRepository User
        {
            get { return new UserRepository(Context); }
        }

        public IClubRepository Club
        {
            get { return new ClubRepository(Context); }
        }

        public IEventRepository Event
        {
            get { return new EventRepository(Context); }
        }

        public IGroupRepository Group
        {
            get { return new GroupRepository(Context); }
        }
    }
}
