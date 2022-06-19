using Context.DAL;
using Context.Settings;
using Context.UnitOfWork;
using Microsoft.Extensions.Options;
using MongoDB.Entities;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utilities;

namespace Context.Repos
{
    public class UserRepository : MongoRepository<User>, IUserRepository
    {
        IOptions<HashingOptions> _hashingOptions;
        PasswordHasher _passwordHasher;
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;
        public UserRepository(MongoDBContext Context) : base(Context)
        {
            _hashingOptions = Options.Create(new HashingOptions());
            _passwordHasher = new PasswordHasher(_hashingOptions);
        }


        public async override Task<User> InsertOneAsync(User document)
        {
            SetUser(document);
            document = await base.InsertOneAsync(document);
            return document;
        }

        public async Task<User> Login(string username, string password)
        {

            User fromdb = await base.FindOneAsync(x => x.UserName == username);

            if (fromdb != null)
            {
                var verified = _passwordHasher.Check(fromdb.HashedPassword, password);

                if (verified == (true,false))
                {

                    return fromdb;

                }
                else
                {
                    log.Warning("Cannot login " + username + " Wrong password");
                }

            }
            else
            {
                log.Warning("User " + username + " not available");
            }

            return null;

        }

        public async override Task<User> UpdateOneAsync(User document)
        {
            SetUser(document);
            document = await base.UpdateOneAsync(document);
            return document;
        }

        public async Task<User> AddOrUpdateGroupsToUser(string userId, List<string> groupIds)
        {
            User userFromdb = await base.FindByIdAsync(userId);
            if(userFromdb != null)
            {
                if(userFromdb.Groups == null)
                {
                    userFromdb.Groups = new List<string>();
                }
                userFromdb.Groups = groupIds;
                return await base.UpdateOneAsync(userFromdb);
                
            }
            return null;
        }

        public async Task<List<User>> ListMemberFromClub(string clubId) { 
            Club clubFromdb = await mongo.Club.FindByIdAsync(clubId);
            if(clubFromdb != null && clubFromdb.MemberIDs.Count > 0)
            {
                List<User> members = new List<User>();
                foreach(var member in clubFromdb.MemberIDs)
                {
                    members.Add(await base.FindByIdAsync(member));
                }
                return members;
            }
            return null;
        }


        private void SetUser(User document)
        {
            if (document.Password != null)
            {
                document.HashedPassword = _passwordHasher.Hash(document.Password);
            }
            

        }

    }
}
