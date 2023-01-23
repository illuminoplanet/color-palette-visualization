import numpy as np


class MiniBatch_KMeans:
    def cluster(self, data, k, n_iter=100, batch_size=512):
        # Initialize centroids
        data_size = data.shape[0]
        centroid = data[np.random.choice(data_size, k)]

        for _ in range(n_iter):
            batch = data[np.random.choice(data_size, batch_size)]
            cluster = self._assign_centroid(batch, centroid)
            centroid, done = self._update_centroid(centroid, cluster)

            if done:
                break

        return centroid, cluster

    def _assign_centroid(self, data, centroid):
        # Return index of closest centroid from each data
        get_closest = lambda x: np.argmin(self._get_distance(centroid, x))
        cluster_idx = np.apply_along_axis(get_closest, axis=1, arr=data)

        # Seperate data by closest centroid, form new clusters
        cluster = []
        for i in range(centroid.shape[0]):
            cluster.append(data[cluster_idx == i])
        return cluster

    def _update_centroid(self, centroid, cluster):
        new_centroid = []
        for i in range(centroid.shape[0]):
            if cluster[i].size:
                new_centroid.append(np.mean(cluster[i], axis=0))
            else:
                # Use previous centroid if cluster is empty
                new_centroid.append(centroid[i])
        new_centroid = np.array(new_centroid, dtype=np.float32)
        # Terminate if update amount is sufficiently small
        done = np.mean(self._get_distance(new_centroid, centroid)) < 1

        return new_centroid, done

    def _get_distance(self, x1, x2):
        dist = np.linalg.norm(x1 - x2, ord=2, axis=1)
        return dist
