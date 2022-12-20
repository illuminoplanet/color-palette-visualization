import numpy as np


class KMeans:
    def __call__(self, data, k, params=None):
        return self._cluster(data, k, params)[0]

    def _cluster(self, data, k, params):

        # Initialize centroids
        data_size = data.shape[0]
        centroid = data[np.random.choice(data_size, k)]
        n_iter = params["n_iter"]
        batch_size = params["batch_size"]

        for i in range(n_iter):
            # Create minibatch of size batch_size from data
            batch = data[np.random.choice(data_size, batch_size)]
            # Assign each data to closest centroid
            cluster = self._assign_centroid(batch, centroid)
            # Update the centroids with current cluster center
            centroid, done = self._update_centroid(centroid, cluster)
            # If update size is within tolerance range, early terminate the loop
            if done:
                break
        return centroid, cluster

    def _assign_centroid(self, data, centroid):

        # Returns index of closest centroid from each data
        get_closest = lambda x: np.argmin(self._get_distance(centroid, x))
        cluster_idx = np.apply_along_axis(get_closest, axis=1, arr=data)

        # Seperate data by closest centroid, form new clusters
        cluster = []
        for i in range(centroid.shape[0]):
            cluster.append(data[cluster_idx == i])
        return cluster

    def _update_centroid(self, centroid, cluster):

        new_centroid = np.array([np.mean(c, axis=0) for c in cluster], dtype=np.float32)
        done = np.mean(self._get_distance(new_centroid, centroid)) < 0.1

        return new_centroid, done

    def _get_distance(self, x1, x2):
        dist = np.linalg.norm(x1 - x2, ord=2, axis=1)
        return dist
