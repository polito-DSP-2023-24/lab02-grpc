import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * A server that hosts the Converter service, plus infrastructure services like health and reflection.
 *
 */
public final class ConversionServer {
  public static void main(String[] args) throws IOException, InterruptedException {
    int port = 50051;
    final Server server = ServerBuilder.forPort(port)
        .addService(new Converter())
        .build()
        .start();
    System.out.println("Listening on port " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        server.shutdown();
        try {
          if (!server.awaitTermination(30, TimeUnit.SECONDS)) {
            server.shutdownNow();
            server.awaitTermination(5, TimeUnit.SECONDS);
          }
        } catch (InterruptedException ex) {
          server.shutdownNow();
        }
      }
    });
    server.awaitTermination();
  }
}