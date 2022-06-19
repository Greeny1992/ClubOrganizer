using Context.DAL;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests
{
    public class DataBaseSeedingTests : BaseUnitTests
    {
        [Test]
        public async Task TestSeeding()
        {
            await CreateUser();
            await CreateUser2();
            await CreateClubWithEventsAndGroups();
            await AddUsersToEvent();
        }

        public async Task CreateUser()
        {
            User user = new User();
            user.UserName = "MaxMust";
            user.Email = "admin@club.at";
            user.Role = Role.Admin;
            user.ValidTill = DateTime.MaxValue;
            user.Password = "123456";
            user.Firstname = "Maxl";
            user.Lastname = "Mustermandl";
            user.Active = true;
            User returnval = await MongoUoW.User.InsertOneAsync(user);

            Assert.NotNull(returnval);
        }

        public async Task CreateUser2()
        {
            User user = new User();
            user.UserName = "AA";
            user.Email = "user@club.at";
            user.Role = Role.Admin;
            user.ValidTill = DateTime.MaxValue;
            user.Password = "123456";
            user.Firstname = "Andreas";
            user.Lastname = "Anderson";
            user.Active= true;
            User returnval = await MongoUoW.User.InsertOneAsync(user);

            Assert.NotNull(returnval);
        }

        public async Task CreateClubWithEventsAndGroups()
        {
            User usr = await MongoUoW.User.FindOneAsync(x => x.UserName == "MaxMust");
            Club club = new Club();
            club.OwnerID = usr.ID;
            club.Name = "testClub";

            Group group = new Group();
            group.Name = "testGruppe";
            group.Description = "testGruppenBeschreibung";

            Event ev = new Event();
            ev.Name = "testEvent";
            ev.Description = "testEventBeschreibung";
            ev.StartDateTime = new DateTime();
            ev.EndDateTime = new DateTime();
            ev.Active = true;

            Club returnClub = await MongoUoW.Club.InsertOneAsync(club);

            await MongoUoW.Club.AddEventToClub(returnClub.ID, ev);
            await MongoUoW.Club.AddGroupToClub(returnClub.ID, group);

            usr.OwnedClub = returnClub.ID;
            usr.Password = "123456";
            usr = await MongoUoW.User.InsertOrUpdateOneAsync(usr);
            returnClub.OwnerID = usr.ID;
            returnClub = await MongoUoW.Club.InsertOrUpdateOneAsync(club);

            Assert.NotNull(returnClub);
        }

        public async Task AddUsersToEvent()
        {
            User acceptUser = await MongoUoW.User.FindOneAsync(x => x.UserName == "MaxMust");
            User cancelUser = await MongoUoW.User.FindOneAsync(x => x.UserName == "AA");

            Event ev = await MongoUoW.Event.FindOneAsync(x => x.Name == "testEvent");
            Club cl = await MongoUoW.Club.FindOneAsync(x => true);

            Club acceptEvent = await MongoUoW.Event.UserAcceptEvent(cl.ID,acceptUser.ID, ev.ID);
            Club cancleEvent = await MongoUoW.Event.UserCancleEvent(cl.ID,cancelUser.ID, ev.ID);
            Assert.NotNull(acceptEvent);
            Assert.NotNull(cancleEvent);

        }


    }
}
