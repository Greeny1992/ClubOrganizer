using Microsoft.Extensions.Configuration;
using Serilog;

namespace Utilities
{
    public static class Logger
    {


        private static ILogger _Logger = null;

        private static Boolean IsInitialized = false;

        public static ILogger ContextLog<T>() where T : class
        {
            if (_Logger == null)
            {
                InitLogger();
            }

            return _Logger.ForContext<T>();
        }


        public static ILogger ILogger
        {
            get { return _Logger; }
        }

        /// <summary>Initializes the Logger based on the Logger Config file</summary>
        public static void InitLogger()
        {
            if (!IsInitialized)
            {
                String folder = Constants.CurrentFolder;

                Serilog.Debugging.SelfLog.Enable(message =>
                {
                    Console.WriteLine(message);
                });

                var configuration = new ConfigurationBuilder()
             .SetBasePath(folder)
             .AddJsonFile("loggerconfig.json")
             .AddJsonFile("loggerconfig.Development.json", true)
             .Build();

                Log.Logger = new LoggerConfiguration()
                    .ReadFrom
                    .Configuration(configuration)
                    .CreateLogger();

                _Logger = Log.Logger;
                Log.Verbose("Logger initialized in Folder " + folder);
                IsInitialized = true;
            }

        }

        public static void Flush()
        {
            Log.CloseAndFlush();
        }


        public static void Warning(String message)
        {
            Log.Warning(message);
            Flush();
        }


        public static void Warning(String message, Exception e)
        {
            Log.Warning(message, e);
            Flush();
        }

        public static void Fatal(String message)
        {
            Log.Fatal(message);
            Flush();
        }

        public static void Fatal(String message, Exception e)
        {
            Log.Fatal(message, e);
            Flush();
        }

        public static void Error(String message)
        {
            Log.Error(message);
            Flush();
        }

        public static void Error(String message, Exception e)
        {
            Log.Error(message, e);
            Flush();
        }

        public static void Information(String message)
        {
            Log.Information(message);
            Flush();
        }

        public static void Information(String message, Exception e)
        {
            Log.Information(message, e);
            Flush();
        }

        public static void Debug(String message)
        {
            Log.Debug(message);
            Flush();
        }

        public static void Debug(String message, Exception e)
        {
            Log.Debug(message, e);
            Flush();
        }

        public static void Verbose(String message)
        {
            Log.Verbose(message);
            Flush();
        }

        public static void Verbose(String message, Exception e)
        {
            Log.Verbose(message, e);
            Flush();
        }
    }
}
