using Context.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos.Concrete
{
    public interface IEventRepository : IMongoRepository<Event>
    {
        Task<Event> FindByName(string name);

        Task<Club> UserAcceptEvent(string clubId, string userId, string eventId);

        Task<Club> UserCancleEvent(string clubId, string userId, string eventId);
    }
}
