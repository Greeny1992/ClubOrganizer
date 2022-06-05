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

        Task<Event> UserAcceptEvent(string userId, string eventId);

        Task<Event> UserCancleEvent(string userId, string eventId);
    }
}
