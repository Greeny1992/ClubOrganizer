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

        public async Task<Club> UserAcceptEvent(string clubId, string userId, string eventId)
        {
            Club clubFromdb = await mongo.Club.FindByIdAsync(clubId);
            if (clubFromdb != null)
            {
                Event eventFromdb = await base.FindByIdAsync(eventId);
                List<Event> tempClubEvents = new List<Event>();
                foreach(Event ev in clubFromdb.Events) {
                    if(ev.ID != eventId)
                    {
                        tempClubEvents.Add(ev);
                    }
                } 
                clubFromdb.Events = tempClubEvents;
                if (eventFromdb != null)
                {
                    User userFromDb = await mongo.User.FindByIdAsync(userId);
                    if (userFromDb != null)
                    {
                        if (eventFromdb.AcceptUsers == null)
                        {
                            eventFromdb.AcceptUsers = new List<User>();
                        }
                        if (eventFromdb.AcceptUsers.FirstOrDefault(x => x.ID == userFromDb.ID) == null)
                        {
                            if (eventFromdb.CancelUsers.FirstOrDefault(x => x.ID == userFromDb.ID) != null)
                            {
                                List<User> tempUsers = new List<User>();
                                foreach (User u in eventFromdb.CancelUsers)
                                {
                                    if (u.ID != userFromDb.ID)
                                    {
                                        tempUsers.Add(u);
                                    }
                                }
                                eventFromdb.CancelUsers = tempUsers;
                            }
                            eventFromdb.AcceptUsers.Add(userFromDb);
                            eventFromdb = await base.UpdateOneAsync(eventFromdb);
                        }
                        clubFromdb.Events.Add(eventFromdb);
                        return await mongo.Club.UpdateOneAsync(clubFromdb);

                    }
                }

            }
            
            return null;
        }

        public async Task<Club> UserCancleEvent(string clubId, string userId, string eventId)
        {
            Club clubFromdb = await mongo.Club.FindByIdAsync(clubId);
            if (clubFromdb != null)
            {
                Event eventFromdb = await base.FindByIdAsync(eventId);
                List<Event> tempClubEvents = new List<Event>();
                foreach (Event ev in clubFromdb.Events)
                {
                    if (ev.ID != eventId)
                    {
                        tempClubEvents.Add(ev);
                    }
                }
                clubFromdb.Events = tempClubEvents;
                if (eventFromdb != null)
                {
                    User userFromDb = await mongo.User.FindByIdAsync(userId);
                    if (userFromDb != null)
                    {
                        if (eventFromdb.CancelUsers == null)
                        {
                            eventFromdb.CancelUsers = new List<User>();
                        }
                        if(eventFromdb.CancelUsers.FirstOrDefault(x => x.ID == userFromDb.ID) == null)
                        {
                            if(eventFromdb.AcceptUsers.FirstOrDefault(x => x.ID == userFromDb.ID) != null)
                            {
                                List<User> tempUsers = new List<User>();
                                foreach (User u in eventFromdb.AcceptUsers)
                                {
                                    if(u.ID != userFromDb.ID)
                                    {
                                        tempUsers.Add(u);
                                    }
                                }
                                eventFromdb.AcceptUsers = tempUsers;
                            }
                            eventFromdb.CancelUsers.Add(userFromDb);
                            eventFromdb = await base.UpdateOneAsync(eventFromdb);
                          
                        }
                        clubFromdb.Events.Add(eventFromdb);
                        return await mongo.Club.UpdateOneAsync(clubFromdb);

                    }
                }

            }

            return null;
        }
    }
}
