using Context.DAL;
using Context.Settings;
using Context.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos.Concrete
{
    public class EventRepository : MongoRepository<Event>, IEventRepository
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;
        public EventRepository(MongoDBContext Context) : base(Context) { }

        public async Task<Event> FindByName(string name)
        {
            return await FindOneAsync(x => x.Name == name);
        }

        public async Task<Event> UserAcceptEvent(string userId, string eventId)
        {
            Event eventFromdb = await base.FindByIdAsync(eventId);
            if (eventFromdb != null)
            {
                User userFromDb = await mongo.User.FindByIdAsync(userId);
                if (userFromDb != null)
                {
                    if (eventFromdb.AcceptUsers == null)
                    {
                        eventFromdb.AcceptUsers = new List<User>();
                    }
                    eventFromdb.AcceptUsers.Add(userFromDb);
                    return await base.UpdateOneAsync(eventFromdb);
                }
            }
            return null;
        }

        public async Task<Event> UserCancleEvent(string userId, string eventId)
        {
            Event eventFromdb = await base.FindByIdAsync(eventId);
            if (eventFromdb != null)
            {
                User userFromDb = await mongo.User.FindByIdAsync(userId);
                if (userFromDb != null)
                {
                    if (eventFromdb.CancelUsers == null)
                    {
                        eventFromdb.CancelUsers = new List<User>();
                    }
                    eventFromdb.CancelUsers.Add(userFromDb);
                    return await base.UpdateOneAsync(eventFromdb);
                }
            }
            return null;
        }
    }
}
