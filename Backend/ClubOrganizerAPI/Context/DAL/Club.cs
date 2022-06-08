using MongoDB.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL
{
    public class Club : MongoDocument
    {
        public string Name { get; set; }

        public User Owner { get; set; }
        public ICollection<User> Admins { get; set; } = new List<User>();
        public ICollection<User> Members { get; set; } = new List<User>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
        public ICollection<Event> Events { get; set; } = new List<Event>();

    }
}
