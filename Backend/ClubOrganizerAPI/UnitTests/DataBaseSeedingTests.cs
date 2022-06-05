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
            user.UserName = "admin@club.at";
            user.Role = Role.Admin;
            user.ValidTill = DateTime.MaxValue;
            user.Password = "123456";
            user.Firstname = "Maxl";
            user.Lastname = "Mustermandl";
            User returnval = await MongoUoW.User.InsertOneAsync(user);

            Assert.NotNull(returnval);
        }

        public async Task CreateUser2()
        {
            User user = new User();
            user.UserName = "user@club.at";
            user.Role = Role.User;
            user.ValidTill = DateTime.MaxValue;
            user.Password = "123456";
            user.Firstname = "Andreas";
            user.Lastname = "Anderson";
            User returnval = await MongoUoW.User.InsertOneAsync(user);

            Assert.NotNull(returnval);
        }

        public async Task CreateClubWithEventsAndGroups()
        {
            Club club = new Club();
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
            Assert.NotNull(returnClub);
        }

        public async Task AddUsersToEvent()
        {
            User acceptUser = MongoUoW.User.FilterBy(x => x.UserName == "admin@club.at").FirstOrDefault();
            User cancelUser = MongoUoW.User.FilterBy(x => x.UserName == "user@club.at").FirstOrDefault();

            Event ev = MongoUoW.Event.FilterBy(x => x.Name == "testEvent").FirstOrDefault();

            Event acceptEvent = await MongoUoW.Event.UserAcceptEvent(acceptUser.ID, ev.ID);
            Event cancleEvent = await MongoUoW.Event.UserCancleEvent(cancelUser.ID, ev.ID);
            Assert.NotNull(acceptEvent);
            Assert.NotNull(cancleEvent);

        }


    }
}
