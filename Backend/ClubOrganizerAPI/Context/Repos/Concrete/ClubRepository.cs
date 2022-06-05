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
    public class ClubRepository : MongoRepository<Club>, IClubRepository
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;
        public ClubRepository(MongoDBContext Context) : base(Context) { }
        public async Task<Club> FindByName(string name)
        {
            return await FindOneAsync(x => x.Name == name);
        }

        public async override Task<Club> FindByIdAsync(string clubId)
        {
            Club clubFromdb = base.FindById(clubId);
            if(clubFromdb != null)
            {
                if(clubFromdb.Events.Any())
                {
                    var newEv = new List<Event>();
                    foreach(var ev in clubFromdb.Events)
                    {
                        var tempEv = await mongo.Event.FindByIdAsync(ev.ID);
                        if(tempEv != null)
                        {
                            if(tempEv.AcceptUsers.Any())
                            {
                                var newAcUser = new List<User>();
                                foreach(var au in tempEv.AcceptUsers)
                                {
                                    var tempUser = await mongo.User.FindByIdAsync(au.ID);
                                    newAcUser.Add(tempUser);
                                }
                                tempEv.AcceptUsers = newAcUser;
                            } else if(tempEv.CancelUsers.Any())
                            {
                                var newCaUser = new List<User>();
                                foreach (var cu in tempEv.CancelUsers)
                                {
                                    var tempUser = await mongo.User.FindByIdAsync(cu.ID);
                                    newCaUser.Add(tempUser);
                                }
                                tempEv.CancelUsers = newCaUser;
                            }
                            tempEv = await mongo.Event.UpdateOneAsync(tempEv);
                            newEv.Add(tempEv);
                        }
                    }
                    clubFromdb.Events = newEv;
                } else if(clubFromdb.Groups.Any())
                {
                    var newGr = new List<Group>();
                    foreach (var gr in clubFromdb.Groups)
                    {
                        var tempGr = await mongo.Group.FindByIdAsync(gr.ID);
                        if (tempGr != null)
                        {
                            newGr.Add(tempGr);
                        }
                    }
                    clubFromdb.Groups = newGr;
                }
                clubFromdb = await mongo.Club.UpdateOneAsync(clubFromdb);
                return clubFromdb;
            }
            return null;
        }

        public async Task<Club> AddEventToClub(string clubId, Event ev)
        {
            Club clubFromdb = await base.FindByIdAsync(clubId);
            if (clubFromdb != null)
            {
                Event evFromdb = await mongo.Event.InsertOrUpdateOneAsync(ev);
                if (evFromdb != null)
                {
                    if (clubFromdb.Events == null)
                    {
                        clubFromdb.Events = new List<Event>();
                    }
                    clubFromdb.Events.Add(evFromdb);
                    return await base.UpdateOneAsync(clubFromdb);
                }
            }
            return null;
        }

        public async Task<Club> AddUserToClub(string clubId, string userId)
        {
            Club clubFromdb = await base.FindByIdAsync(clubId);
            if (clubFromdb != null)
            {
                User userFromDb = await mongo.User.FindByIdAsync(userId);
                if (userFromDb != null)
                {
                    if (clubFromdb.Members == null)
                    {
                        clubFromdb.Members = new List<User>();
                    }
                    clubFromdb.Members.Add(userFromDb);
                    return await base.UpdateOneAsync(clubFromdb);
                }
            }
            return null;
        }

        public async Task<Club> AddGroupToClub(string clubId, Group group)
        {
            Club clubFromdb = await base.FindByIdAsync(clubId);
            if (clubFromdb != null)
            {
                Group groupFromdb = await mongo.Group.InsertOrUpdateOneAsync(group);
                if (groupFromdb != null)
                {
                    if (clubFromdb.Groups == null)
                    {
                        clubFromdb.Groups = new List<Group>();
                    }
                    clubFromdb.Groups.Add(groupFromdb);
                    return await base.UpdateOneAsync(clubFromdb);
                }
            }
            return null;
        }
    }
}
