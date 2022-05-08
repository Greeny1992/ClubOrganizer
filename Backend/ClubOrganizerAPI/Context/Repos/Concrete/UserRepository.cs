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

        public async Task<User> Login(string username, string password)
        {
            var user = await this.FindOneAsync(u => u.UserName == username);
            if(user != null)
            {
                var test = _passwordHasher.Check(user.HashedPassword, password);
                if(test == (true,false))
                {
                    return user;
                }else
                {
                    log.Error("Wrong Password");
                    return null;
                };
            }
            this.log.Error(username + "does not exist");
            return null;
        }

        public override async Task<User> InsertOrUpdateOneAsync(User u)
        {
            if(u.Password != null)
                u.HashedPassword = _passwordHasher.Hash(u.Password);
            await u.SaveAsync();

            return u;
        }


    }
}
