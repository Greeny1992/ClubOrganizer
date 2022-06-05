using Context.DAL;
using Context.Settings;
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


        private void SetUser(User document)
        {
            document.HashedPassword = _passwordHasher.Hash(document.Password);

        }


    }
}
