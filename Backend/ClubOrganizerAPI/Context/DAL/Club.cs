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
        public IEnumerable<User> Members { get; set; }
        public IEnumerable<Group> Groups { get; set; }
        public IEnumerable<Event> Events { get; set; }

    }
}
